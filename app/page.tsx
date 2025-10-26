'use client';
import { useState, useEffect, memo, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation, useHomepageTranslation } from '@/lib/hooks/useTranslation';

import { useCart } from '@/lib/contexts/CartContext';
import { ClientOnly } from '@/components/common/ClientOnly';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { getProductImageUrl } from '@/lib/utils/image-helpers';
import { PrescriptionNotificationService } from '@/lib/services/prescriptionNotificationService';
import { filterProducts } from '@/lib/data/products';

// Lazy load the search component for better performance
const ComprehensiveSearch = dynamic(
    () =>
        import('@/components/search/ComprehensiveSearch').then((mod) => ({
            default: mod.ComprehensiveSearch,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" data-oid="r7jbp01" />
        ),
    },
);

// Define category mappings from client.tsx.txt
const CATEGORY_MAPPINGS = {
    painRelievers: ['pain-relievers', 'medications', 'analgesics', 'antibiotics'],
    supplements: ['supplements-vitamins', 'vitamins', 'supplements', 'nutritional-supplements'],
    babyEssentials: ['baby-essentials', 'baby-care', 'infant-care', 'baby-formula', 'baby'],
    skinCare: ['skin-care', 'skincare', 'dermatology', 'cosmetics', 'beauty'],
};

const Page = memo(function Page() {

    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [addedItems, setAddedItems] = useState<{ [key: string]: number }>({});
    const [currentSlide, setCurrentSlide] = useState(0);

    // Product state from client.tsx.txt
    const [allProducts, setAllProducts] = useState([]);
    const [categorizedProducts, setCategorizedProducts] = useState({
        painRelievers: [],
        supplements: [],
        babyEssentials: [],
        skinCare: [],
    });
    const [loading, setLoading] = useState(true);
    const [availableCategories, setAvailableCategories] = useState(new Set());

    const { locale } = useLanguage();
    const { t } = useTranslation();
    const { t: tHomepage } = useHomepageTranslation();
    const { items } = useCart();

    // Refs for scrollable containers
    const painRelieversScrollRef = useRef<HTMLDivElement>(null);
    const supplementsScrollRef = useRef<HTMLDivElement>(null);
    const babyEssentialsScrollRef = useRef<HTMLDivElement>(null);
    const skinCareScrollRef = useRef<HTMLDivElement>(null);

    // Swipe functionality for mobile slider
    const sliderRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Fetch products on component mount from client.tsx.txt
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products without category filter to get complete dataset
                const result = await filterProducts({
                    page: 1,
                    limit: 100, // Adjust based on your needs
                    sortBy: 'name'
                });

                console.log('Fetched products:', result.products);
                setAllProducts(result.products);

                // Extract unique categories from fetched products
                const categories = new Set();
                result.products.forEach(product => {
                    if (product.category) {
                        categories.add(product.category.toLowerCase());
                    }
                });

                console.log('Available categories:', Array.from(categories));
                setAvailableCategories(categories);

                // Categorize products based on predefined mappings
                const categorized = {
                    painRelievers: [],
                    supplements: [],
                    babyEssentials: [],
                    skinCare: [],
                };
                result.products.forEach(product => {
                    const productCategory = product.category?.toLowerCase() || '';

                    if (CATEGORY_MAPPINGS.painRelievers.some(cat =>
                        productCategory.includes(cat) || cat.includes(productCategory)
                    )) {
                        categorized.painRelievers.push(product);
                    }

                    if (CATEGORY_MAPPINGS.supplements.some(cat =>
                        productCategory.includes(cat) || cat.includes(productCategory)
                    )) {
                        categorized.supplements.push(product);
                    }

                    if (CATEGORY_MAPPINGS.babyEssentials.some(cat =>
                        productCategory.includes(cat) || cat.includes(productCategory)
                    )) {
                        categorized.babyEssentials.push(product);
                    }

                    if (CATEGORY_MAPPINGS.skinCare.some(cat =>
                        productCategory.includes(cat) || cat.includes(productCategory)
                    )) {
                        categorized.skinCare.push(product);
                    }
                });

                // Limit products per category for homepage display
                const limitedCategorized = {
                    painRelievers: categorized.painRelievers.slice(0, 8),
                    supplements: categorized.supplements.slice(0, 8),
                    babyEssentials: categorized.babyEssentials.slice(0, 8),
                    skinCare: categorized.skinCare.slice(0, 8),
                };

                console.log('Categorized products:', limitedCategorized);
                setCategorizedProducts(limitedCategorized);

            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    // Banner slides data from second code
    const bannerSlides = useMemo(
        () => [
            {
                id: 1,
                type: 'subscription',
                title: tHomepage('hero.subscriptionTitle'),
                subtitle: tHomepage('hero.subscriptionSubtitle'),
                description: tHomepage('hero.subscriptionDescription'),
                features: [
                    tHomepage('features.upToSavings'),
                    tHomepage('features.freeDelivery'),
                    tHomepage('features.pauseAnytime'),
                ],
                primaryButton: {
                    text: tHomepage('hero.startSubscription'),
                    href: '/customer/dashboard?tab=subscriptions',
                    icon: 'plus',
                },
                secondaryButton: {
                    text: tHomepage('hero.browseProducts'),
                    href: '/shop',
                    icon: 'arrow',
                },
                bgGradient: 'from-[#1F1F6F] to-[#14274E]',
                emoji: '📅',
            },
        {
            id: 2,
            type: 'healthcare',
            title: 'Confidence, Curated.',
            subtitle: 'Your trusted wellness guide for Ismailia',
            description: 'Discover the best, most effective products, hand-picked for you.',
            features: [
                'Licensed & Trusted',
                'Quality guaranteed',
                'Free Delivery',
            ],
            primaryButton: {
                text: 'Shop the Founding Collection',
                href: '/shop',
                icon: 'plus',
            },
            secondaryButton: {
                text: 'Browse Products',
                href: '/shop',
                icon: 'arrow',
            },
            bgGradient: 'from-[#1F1F6F] to-[#14274E]',
            emoji: '🏥',
        },
        ],
        [tHomepage],
    );

    // Auto-slide effect - continuously slide to the left
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 6000); // Change slide every 6 seconds

        return () => clearInterval(interval);
    }, [bannerSlides.length]);

    // Initialize prescription notification service for demo (without sound)
    useEffect(() => {
        // Start prescription workflow simulation for demo purposes
        PrescriptionNotificationService.startPrescriptionWorkflowSimulation();
    }, []);

    // Scroll functions for product sections
    const scrollLeft = useCallback((ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -280, behavior: 'smooth' });
        }
    }, []);

    const scrollRight = useCallback((ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
    }, []);

    // Helper function to get product image or fallback - Updated for R2
    const getProductImage = useCallback((product) => {
        return getProductImageUrl(product);
    }, []);

    // Helper function to get product color based on category from client.tsx.txt
    const getProductColor = useCallback((product) => {
        const category = product.category?.toLowerCase() || '';
        if (CATEGORY_MAPPINGS.painRelievers.some(cat => category.includes(cat))) {
            return 'bg-gradient-to-br from-cura-primary/20 to-cura-secondary/30';
        }
        if (CATEGORY_MAPPINGS.supplements.some(cat => category.includes(cat))) {
            return 'bg-gradient-to-br from-yellow-100 to-yellow-200';
        }
        if (CATEGORY_MAPPINGS.babyEssentials.some(cat => category.includes(cat))) {
            return 'bg-gradient-to-br from-pink-100 to-pink-200';
        }
        if (CATEGORY_MAPPINGS.skinCare.some(cat => category.includes(cat))) {
            return 'bg-gradient-to-br from-cura-accent/20 to-cura-light/30';
        }
        return 'bg-gradient-to-br from-gray-100 to-gray-200';
    }, []);

    // Helper function to format price from client.tsx.txt
    const formatPrice = useCallback((price) => {
        return `${price} EGP`;
    }, []);

    // Function to get item quantity in cart from client.tsx.txt
    const getItemQuantityInCart = useCallback(
        (productId: string) => {
            return addedItems[productId] || 0;
        },
        [addedItems],
    );

    // Function to render cart button based on state from client.tsx.txt
    const renderCartButton = useCallback(
        (product) => {
            const quantity = getItemQuantityInCart(product._id.toString());
            const isInCart = quantity > 0;
            const handleCartClick = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/product/${product._id}`;
            };

            // In cart state
            if (isInCart) {
                return (
                    <button
                        onClick={handleCartClick}
                        className="w-full bg-green-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition-all duration-300 mt-auto transform hover:scale-105 active:scale-95 hover:shadow-lg flex items-center justify-center space-x-2"
                        data-oid="sdt9guj"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="i6qjdka"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                                data-oid="9_ax9g8"
                            />
                        </svg>
                        <span data-oid="szznt2.">
                            {tHomepage('hardcoded.inCart', { quantity })}
                        </span>
                    </button>
                );
            }

            // Default view options state
            return (
                <button
                    onClick={handleCartClick}
                    className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-2 rounded-lg text-xs font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 mt-auto transform hover:scale-105 active:scale-95 hover:shadow-lg"
                    data-oid="4pv3_io"
                >
                    {t('viewOptions')}
                </button>
            );
        },
        [getItemQuantityInCart, t, tHomepage],
    );

    // Product card component for reusability from client.tsx.txt
    const ProductCard = useCallback(({ product, size = 'default' }) => {
        const cardWidth = size === 'mobile' ? 'w-40' : 'w-64';
        const cardHeight = size === 'mobile' ? 'h-60' : 'h-84';
        const imageHeight = size === 'mobile' ? 'h-28' : 'h-48';
        return (
            <Link key={product._id} href={`/product/${product._id}`} className={`group flex-shrink-0 ${cardWidth}`}>
                <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-200 ${cardHeight} flex flex-col`}>
                    <div className={`${imageHeight} ${getProductColor(product)} flex items-center justify-center relative flex-shrink-0`}>
                        {(() => {
                            const imageResult = getProductImage(product);
                            const isImageUrl = typeof imageResult === 'string' && (
                                imageResult.startsWith('/') || 
                                imageResult.startsWith('http://') || 
                                imageResult.startsWith('https://')
                            );
                            
                            return isImageUrl ? (
                                <img src={imageResult} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-3xl opacity-80">
                                    {imageResult}
                                </span>
                            );
                        })()}
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="absolute top-2 left-2 bg-cura-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                SALE
                            </div>
                        )}
                        {product.prescription && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                RX
                            </div>
                        )}
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2 min-h-[20px]">{product.description}</p>
                        <div className="mt-2 flex-grow flex flex-col justify-end">
                            <div className="flex items-center space-x-2">
                                <span className="text-cura-primary font-bold text-base">
                                    {formatPrice(product?.overallLowestPrice)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-gray-400 text-xs line-through">
                                        {formatPrice(product.overallHighestPrice)}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2">
                                {renderCartButton(product)}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }, [getProductColor, getProductImage, formatPrice, renderCartButton]);

    // Swipe handling functions
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

        if (isLeftSwipe) {
            // Swipe left - next slide
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }
        if (isRightSwipe) {
            // Swipe right - previous slide
            setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
        }
    };


    
    return (
        <div className="min-h-screen bg-gray-50 md:bg-white" data-oid="dyk4epq">
            <ResponsiveHeader data-oid="homepage-header" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="b_w195s">
                <ClientOnly fallback={<div style={{ height: '60px' }} data-oid="l5eivym" />}>
                    <CategoriesBar data-oid="1dps:og" />
                </ClientOnly>
            </div>

            {/* Mobile Hero Section */}
            <section className="bg-white md:hidden" data-oid="dtcz.o.">
                <div className="px-4 py-4" data-oid="yvw2xsp">
                    {/* Search Bar - Using Desktop Version */}
                    <div className="mb-4" data-oid="7ulets6">
                        <ClientOnly fallback={
                            <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" data-oid="p5fgran" />
                        }>
                            <ComprehensiveSearch
                                variant="header"
                                placeholder={t('search.placeholder') || 'Search for medicines and more...'}
                                className="w-full"
                                data-oid="mobile-search"
                            />
                        </ClientOnly>
                    </div>

                    {/* Wellness Banner V2 */}
                    <div className="relative w-full aspect-[21/7] max-w-screen-xl mx-auto max-h-48 md:max-h-56 lg:max-h-64 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(20,39,78,0.15)] mb-6" data-oid="banner-container">
                        <div className="w-full h-full bg-gradient-to-br from-[#14274E] to-[#394867] flex flex-col justify-center items-center text-center p-[5%_8%] relative overflow-hidden" data-oid="banner">
                            {/* Organic Shapes */}
                            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#9BA4B4]/8 rounded-[60%_40%_70%_30%_/_40%_50%_60%_50%] animate-morphing-1"></div>
                            <div className="absolute bottom-[-15%] left-[-8%] w-[300px] h-[300px] bg-[#9BA4B4]/6 rounded-[40%_60%_30%_70%_/_50%_60%_40%_50%] animate-morphing-2"></div>
                            <div className="absolute top-[40%] left-[10%] w-[200px] h-[200px] bg-white/8 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] animate-morphing-3"></div>

                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-radial-1 opacity-3 bg-radial-2 opacity-2"></div>

                            {/* Content - Mobile Layout */}
                            <div className="relative z-10 max-w-[900px] px-2 h-full" data-oid="content">
                                {/* Text at top left */}
                                <div className="animate-fade-in-up-delay-1">
                                    <h1 className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight tracking-tight text-left" data-oid="headline">
                                        Confidence, Curated.
                                    </h1>
                                    <p className="text-xs sm:text-sm text-[#9BA4B4] leading-relaxed text-left max-w-none" data-oid="subheadline">
                                        Your trusted wellness guide for Ismailia. Discover the best, most effective products, hand-picked for you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* Desktop Wellness Banner */}
            <section className="relative bg-white overflow-hidden hidden md:block">
                <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="relative w-full aspect-[21/7] max-w-screen-xl mx-auto max-h-48 md:max-h-56 lg:max-h-64 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(20,39,78,0.15)]" data-oid="desktop-banner-container">
                        <div className="w-full h-full bg-gradient-to-br from-[#14274E] to-[#394867] flex flex-col justify-center items-center text-center p-[5%_8%] relative overflow-hidden" data-oid="desktop-banner">
                            {/* Organic Shapes */}
                            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] bg-[#9BA4B4]/8 rounded-[60%_40%_70%_30%_/_40%_50%_60%_50%] animate-morphing-1"></div>
                            <div className="absolute bottom-[-15%] left-[-8%] w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-[#9BA4B4]/6 rounded-[40%_60%_30%_70%_/_50%_60%_40%_50%] animate-morphing-2"></div>
                            <div className="absolute top-[30%] left-[15%] w-[250px] h-[250px] lg:w-[500px] lg:h-[500px] bg-white/6 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] animate-morphing-3"></div>

                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-radial-gradient opacity-3"></div>

                            {/* Content */}
                            <div className="relative z-10 max-w-[900px]" data-oid="desktop-content">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight tracking-tight animate-fade-in-up-delay-1" data-oid="desktop-headline">
                                    Confidence, Curated.
                                </h1>
                                <p className="text-base md:text-lg text-[#9BA4B4] max-w-[700px] mx-auto mb-5 md:mb-6 leading-relaxed font-medium animate-fade-in-up-delay-3" data-oid="desktop-subheadline">
                                    Your trusted wellness guide for Ismailia. Discover the best, most effective products, hand-picked for you.
                                </p>
                                <div className="relative animate-fade-in-up-delay-5" data-oid="desktop-cta-button">
                                    <Link href="/shop" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#14274E] font-semibold text-base rounded-lg no-underline shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                                        <span className="relative z-1">Shop the Founding Collection</span>
                                        <div className="absolute inset-0 bg-[#9BA4B4]/1 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg"></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Categories - Swipeable Cards */}
            <section className="bg-white md:hidden">
                <div className="py-4">
                    <div className="px-4 mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                    </div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-3 px-4 pb-2">
                        {[
                            { name: 'Hair Care', href: '/haircare' },
                            { name: 'Skin Care', href: '/skincare' },
                            { name: 'Daily Essentials', href: '/daily-essentials' },
                            { name: 'Baby Essentials', href: '/baby-essentials' },
                            { name: 'Vitamins', href: '/vitamins' },
                            { name: 'Sexual Wellness', href: '/sexual-wellness' },
                        ].map((category, index) => (
                                <Link
                                    key={index}
                                    href={category.href}
                                    className="flex-shrink-0 group"
                                >
                                    <div className="bg-gray-50 group-hover:bg-cura-primary group-active:bg-cura-primary px-4 py-3 rounded-xl border border-gray-200 group-hover:border-cura-primary group-active:border-cura-primary transition-all duration-200 shadow-sm group-hover:shadow-md group-active:shadow-md">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-white group-active:text-white whitespace-nowrap transition-colors duration-200">
                                            {category.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Render fetched products from client.tsx.txt with second code styling */}
            {loading && <p className="text-center mt-8">Loading products...</p>}
            {!loading && (
                <>
                    {/* Pain Relievers Section - Mobile */}
                    {categorizedProducts.painRelievers.length > 0 && (
                        <section className="bg-white md:hidden">
                            <div className="px-4 py-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">💊</div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {tHomepage('sections.painRelievers')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=pain-relievers"
                                        className="text-sm text-cura-primary font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.painRelievers.map((product: any) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="group flex-shrink-0 w-40"
                                                data-oid="supplement-item"
                                            >
                                                <div
                                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-200 h-60 flex flex-col"
                                                    data-oid="supplement-card"
                                                >
                                                    <div
                                                        className={`h-28 ${getProductColor(product)} flex items-center justify-center relative flex-shrink-0`}
                                                        data-oid="supplement-image"
                                                    >
                                                        {(() => {
                                                            const imageResult = getProductImage(product);
                                                            const isImageUrl = typeof imageResult === 'string' && (
                                                                imageResult.startsWith('/') || 
                                                                imageResult.startsWith('http://') || 
                                                                imageResult.startsWith('https://')
                                                            );
                                                            
                                                            return isImageUrl ? (
                                                                <img src={imageResult} alt={product.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <span
                                                                    className="text-3xl opacity-80"
                                                                    data-oid="supplement-emoji"
                                                                >
                                                                    {imageResult}
                                                                </span>
                                                            );
                                                        })()}
                                                        {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                            <div
                                                                className="absolute top-2 left-2 bg-cura-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                                                                data-oid="supplement-discount"
                                                            >
                                                                SALE
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="p-3 flex flex-col flex-grow"
                                                        data-oid="supplement-content"
                                                    >
                                                        <h3
                                                            className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-8 flex-shrink-0"
                                                            data-oid="supplement-name"
                                                        >
                                                            {product.name}
                                                        </h3>
                                                        <div className="mt-2 flex-grow flex flex-col justify-end">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-cura-primary font-bold text-base">
                                                                    {formatPrice(product?.priceReference || product.overallAveragePrice)}
                                                                </span>
                                                                {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                                    <span className="text-gray-400 text-xs line-through">
                                                                        {formatPrice(product.originalPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-2">
                                                                {renderCartButton(product)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Supplements & Vitamins Section - Mobile */}
                    {categorizedProducts.supplements.length > 0 && (
                        <section className="bg-gray-50 md:hidden">
                            <div className="px-4 py-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">💊</div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {tHomepage('sections.supplementsVitamins')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=supplements-vitamins"
                                        className="text-sm text-cura-primary font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.supplements.map((product: any) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="group flex-shrink-0 w-40"
                                                data-oid="supplement-item"
                                            >
                                                <div
                                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-200 h-60 flex flex-col"
                                                    data-oid="supplement-card"
                                                >
                                                    <div
                                                        className={`h-28 ${getProductColor(product)} flex items-center justify-center relative flex-shrink-0`}
                                                        data-oid="supplement-image"
                                                    >
                                                        {(() => {
                                                            const imageResult = getProductImage(product);
                                                            const isImageUrl = typeof imageResult === 'string' && (
                                                                imageResult.startsWith('/') || 
                                                                imageResult.startsWith('http://') || 
                                                                imageResult.startsWith('https://')
                                                            );
                                                            
                                                            return isImageUrl ? (
                                                                <img src={imageResult} alt={product.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <span
                                                                    className="text-3xl opacity-80"
                                                                    data-oid="supplement-emoji"
                                                                >
                                                                    {imageResult}
                                                                </span>
                                                            );
                                                        })()}
                                                        {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                            <div
                                                                className="absolute top-2 left-2 bg-cura-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                                                                data-oid="supplement-discount"
                                                            >
                                                                SALE
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="p-3 flex flex-col flex-grow"
                                                        data-oid="supplement-content"
                                                    >
                                                        <h3
                                                            className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10 flex-shrink-0"
                                                            data-oid="supplement-name"
                                                        >
                                                            {product.name}
                                                        </h3>
                                                        <div className="mt-2 flex-grow flex flex-col justify-end">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-cura-primary font-bold text-base">
                                                                    {formatPrice(product?.priceReference || product.overallAveragePrice)}
                                                                </span>
                                                                {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                                    <span className="text-gray-400 text-xs line-through">
                                                                        {formatPrice(product.originalPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-2">
                                                                {renderCartButton(product)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Baby Essentials Section - Mobile */}
                    {categorizedProducts.babyEssentials.length > 0 && (
                        <section className="bg-white md:hidden">
                            <div className="px-4 py-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">👶</div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {tHomepage('sections.babyEssentials')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=baby-essentials"
                                        className="text-sm text-cura-primary font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.babyEssentials.map((product: any) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="group flex-shrink-0 w-40"
                                                data-oid="supplement-item"
                                            >
                                                <div
                                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-200 h-60 flex flex-col"
                                                    data-oid="supplement-card"
                                                >
                                                    <div
                                                        className={`h-28 ${getProductColor(product)} flex items-center justify-center relative flex-shrink-0`}
                                                        data-oid="supplement-image"
                                                    >
                                                        {(() => {
                                                            const imageResult = getProductImage(product);
                                                            const isImageUrl = typeof imageResult === 'string' && (
                                                                imageResult.startsWith('/') || 
                                                                imageResult.startsWith('http://') || 
                                                                imageResult.startsWith('https://')
                                                            );
                                                            
                                                            return isImageUrl ? (
                                                                <img src={imageResult} alt={product.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <span
                                                                    className="text-3xl opacity-80"
                                                                    data-oid="supplement-emoji"
                                                                >
                                                                    {imageResult}
                                                                </span>
                                                            );
                                                        })()}
                                                        {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                            <div
                                                                className="absolute top-2 left-2 bg-cura-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                                                                data-oid="supplement-discount"
                                                            >
                                                                SALE
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="p-3 flex flex-col flex-grow"
                                                        data-oid="supplement-content"
                                                    >
                                                        <h3
                                                            className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10 flex-shrink-0"
                                                            data-oid="supplement-name"
                                                        >
                                                            {product.name}
                                                        </h3>
                                                        <div className="mt-2 flex-grow flex flex-col justify-end">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-cura-primary font-bold text-base">
                                                                    {formatPrice(product?.priceReference || product.overallAveragePrice)}
                                                                </span>
                                                                {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                                    <span className="text-gray-400 text-xs line-through">
                                                                        {formatPrice(product.originalPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-2">
                                                                {renderCartButton(product)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Skin Care Products Section - Mobile */}
                    {categorizedProducts.skinCare.length > 0 && (
                        <section className="bg-gray-50 md:hidden">
                            <div className="px-4 py-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">🧴</div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {tHomepage('sections.skinCareProducts')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=skin-care"
                                        className="text-sm text-cura-primary font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.skinCare.map((product: any) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="group flex-shrink-0 w-40"
                                                data-oid="supplement-item"
                                            >
                                                <div
                                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-200 h-60 flex flex-col"
                                                    data-oid="supplement-card"
                                                >
                                                    <div
                                                        className={`h-28 ${getProductColor(product)} flex items-center justify-center relative flex-shrink-0`}
                                                        data-oid="supplement-image"
                                                    >
                                                        {(() => {
                                                            const imageResult = getProductImage(product);
                                                            const isImageUrl = typeof imageResult === 'string' && (
                                                                imageResult.startsWith('/') || 
                                                                imageResult.startsWith('http://') || 
                                                                imageResult.startsWith('https://')
                                                            );
                                                            
                                                            return isImageUrl ? (
                                                                <img src={imageResult} alt={product.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <span
                                                                    className="text-3xl opacity-80"
                                                                    data-oid="supplement-emoji"
                                                                >
                                                                    {imageResult}
                                                                </span>
                                                            );
                                                        })()}
                                                        {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                            <div
                                                                className="absolute top-2 left-2 bg-cura-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                                                                data-oid="supplement-discount"
                                                            >
                                                                SALE
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="p-3 flex flex-col "
                                                        data-oid="supplement-content"
                                                    >
                                                        <h3
                                                            className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-5 flex-shrink-0"
                                                            data-oid="supplement-name"
                                                        >
                                                            {product.name}
                                                        </h3>
                                                        <div className="mt-2 flex-grow flex flex-col justify-end">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-cura-primary font-bold text-base">
                                                                    {formatPrice(product?.priceReference || product.overallAveragePrice)}
                                                                </span>
                                                                {product.originalPrice && product.originalPrice > (product?.priceReference || product.overallAveragePrice) && (
                                                                    <span className="text-gray-400 text-xs line-through">
                                                                        {formatPrice(product.originalPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-2">
                                                                {renderCartButton(product)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Desktop Sections */}
                    {/* Pain Relievers Section - Desktop */}
                    {categorizedProducts.painRelievers.length > 0 && (
                        <section className="py-20 bg-white hidden md:block">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center space-x-5">
                                        <div className="text-3xl">💊</div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                                            {tHomepage('sections.painRelievers')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=pain-relievers"
                                        className="flex items-center space-x-2 text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors duration-300 text-sm"
                                    >
                                        <span>{tHomepage('cta.showAll')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.painRelievers.map(product => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Supplements & Vitamins Section - Desktop */}
                    {categorizedProducts.supplements.length > 0 && (
                        <section className="py-20 bg-white hidden md:block">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center space-x-5">
                                        <div className="text-3xl">💊</div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                                            {tHomepage('sections.supplementsVitamins')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=supplements-vitamins"
                                        className="flex items-center space-x-2 text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors duration-300 text-sm"
                                    >
                                        <span>{tHomepage('cta.showAll')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.supplements.map(product => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Baby Essentials Section - Desktop */}
                    {categorizedProducts.babyEssentials.length > 0 && (
                        <section className="py-20 bg-white hidden md:block">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center space-x-5">
                                        <div className="text-3xl">👶</div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                                            {tHomepage('sections.babyEssentials')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=baby-essentials"
                                        className="flex items-center space-x-2 text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors duration-300 text-sm"
                                    >
                                        <span>{tHomepage('cta.showAll')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.babyEssentials.map(product => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Skin Care Products Section - Desktop */}
                    {categorizedProducts.skinCare.length > 0 && (
                        <section className="py-20 bg-white hidden md:block">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center space-x-5">
                                        <div className="text-3xl">🧴</div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                                            {tHomepage('sections.skinCareProducts')}
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop?category=skin-care"
                                        className="flex items-center space-x-2 text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors duration-300 text-sm"
                                    >
                                        <span>{tHomepage('cta.showAll')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex space-x-4 pb-2">
                                        {categorizedProducts.skinCare.map(product => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Footer */}
            <div>
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

            <div className="h-20 md:hidden"></div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{toastMessage}</span>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
});

export default Page;
