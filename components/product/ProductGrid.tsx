'use client';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/data/products';
interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    onAddToCart?: (productId: number) => void;
    onResetFilters?: () => void;
    isMobile?: boolean;
}
export function ProductGrid({
    products,
    loading = false,
    onAddToCart,
    onResetFilters,
    isMobile = false,
}: ProductGridProps) {
    console.log(products)
    if (loading) {
        return (
            <div
                className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}
                data-oid="loading-grid"
            >
                {' '}
                {[...Array(isMobile ? 4 : 6)].map((_, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse ${isMobile ? 'h-64' : 'h-80'}`}
                        data-oid="loading-card"
                    >
                        {' '}
                        <div
                            className={`bg-gray-200 ${isMobile ? 'h-32' : 'h-48'}`}
                            data-oid="loading-image"
                        ></div>{' '}
                        <div
                            className={`p-3 ${isMobile ? 'space-y-2' : 'p-5 space-y-3'}`}
                            data-oid="loading-content"
                        >
                            {' '}
                            <div
                                className="h-4 bg-gray-200 rounded"
                                data-oid="loading-title"
                            ></div>{' '}
                            <div
                                className="h-3 bg-gray-200 rounded w-3/4"
                                data-oid="loading-description"
                            ></div>{' '}
                            <div
                                className="h-3 bg-gray-200 rounded w-1/2"
                                data-oid="loading-price"
                            ></div>{' '}
                            <div
                                className={`h-8 bg-gray-200 rounded ${isMobile ? 'mt-2' : 'mt-3'}`}
                                data-oid="loading-button"
                            ></div>{' '}
                        </div>{' '}
                    </div>
                ))}{' '}
            </div>
        );
    }
    if (products.length === 0) {
        return (
            <div className={`text-center ${isMobile ? 'py-12' : 'py-16'}`} data-oid="no-products">
                {' '}
                <div
                    className={`${isMobile ? 'text-4xl mb-3' : 'text-6xl mb-4'}`}
                    data-oid="no-products-icon"
                >
                    {' '}
                    📦{' '}
                </div>{' '}
                <h3
                    className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}
                    data-oid="no-products-title"
                >
                    {' '}
                    No products available{' '}
                </h3>{' '}
                <p
                    className={`text-gray-600 mb-6 ${isMobile ? 'text-sm' : 'text-base'}`}
                    data-oid="no-products-description"
                >
                    {' '}
                    {isMobile
                        ? 'Try selecting a different category or check back later.'
                        : 'Please select your city to view available products and pharmacies in your area'}{' '}
                </p>{' '}
                {onResetFilters && (
                    <button
                        onClick={onResetFilters}
                        className={`bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}
                        data-oid="reset-filters-button"
                    >
                        {' '}
                        {isMobile ? 'View All Products' : 'Reset Filters'}{' '}
                    </button>
                )}{' '}
            </div>
        );
    }
    return (
        <div
            className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}
            data-oid="products-grid"
        >
            {products.map((product) => (
                <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    isMobile={isMobile}
                    data-oid="product-card"
                />
            ))}
        </div>
    );
}
