/**
 * Image Helper Utilities for R2 Image Handling
 * Handles both legacy image fields and new R2 images array structure
 */

interface R2Image {
  url: string;
  key: string;
  filename: string;
  originalName: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface ProductWithImages {
  image?: string; // Legacy field
  images?: R2Image[]; // New R2 images array
  category?: string;
}

/**
 * Get the primary image URL from a product, handling both R2 and legacy structures
 * @param product - Product object with potential image data
 * @param fallbackImage - Optional fallback image URL
 * @returns Image URL or category-based fallback
 */
export function getProductImageUrl(product: ProductWithImages, fallbackImage?: string): string {
  // Check R2 images array first (new structure)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0].url;
  }
  
  // Fallback to legacy image field
  if (product.image && product.image !== '/placeholder-medicine.jpg') {
    return product.image;
  }
  
  // Use provided fallback
  if (fallbackImage) {
    return fallbackImage;
  }
  
  // Return category-based emoji as final fallback
  return getCategoryEmoji(product.category);
}

/**
 * Get all image URLs from a product
 * @param product - Product object with potential image data
 * @returns Array of image URLs
 */
export function getAllProductImageUrls(product: ProductWithImages): string[] {
  // Use R2 images if available
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images.map(img => img.url);
  }
  
  // Fallback to legacy image
  if (product.image) {
    return [product.image];
  }
  
  // Return empty array if no images
  return [];
}

/**
 * Get category-based emoji fallback
 * @param category - Product category
 * @returns Emoji string
 */
export function getCategoryEmoji(category?: string): string {
  if (!category) return '💊';
  
  const cat = category.toLowerCase();
  
  // Category mappings
  if (cat.includes('pain') || cat.includes('medicine') || cat.includes('tablet')) return '💊';
  if (cat.includes('supplement') || cat.includes('vitamin')) return '💊';
  if (cat.includes('baby') || cat.includes('infant')) return '👶';
  if (cat.includes('skin') || cat.includes('hair') || cat.includes('beauty')) return '🧴';
  if (cat.includes('dental') || cat.includes('oral')) return '🦷';
  if (cat.includes('eye') || cat.includes('vision')) return '👁️';
  if (cat.includes('heart') || cat.includes('cardiac')) return '❤️';
  
  return '💊'; // Default fallback
}

/**
 * Check if a product has valid images
 * @param product - Product object
 * @returns Boolean indicating if product has images
 */
export function hasProductImages(product: ProductWithImages): boolean {
  return (
    (product.images && Array.isArray(product.images) && product.images.length > 0) ||
    (product.image && product.image !== '/placeholder-medicine.jpg')
  );
}

/**
 * Get optimized image URL with width/height parameters
 * @param imageUrl - Original image URL
 * @param width - Desired width
 * @param height - Desired height (optional)
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  imageUrl: string, 
  width: number, 
  height?: number, 
  quality: number = 75
): string {
  // If it's a placeholder or emoji, return as-is
  if (!imageUrl || imageUrl.startsWith('/api/placeholder') || imageUrl.length === 2) {
    return imageUrl;
  }
  
  // If it's an R2 URL, we might add optimization parameters in the future
  if (imageUrl.includes('r2.dev')) {
    // For now, return the original R2 URL
    // In the future, we could add Cloudflare Image Resizing parameters
    return imageUrl;
  }
  
  // For other URLs, return as-is
  return imageUrl;
}

/**
 * Create a safe image component props object
 * @param product - Product with image data
 * @param alt - Alt text for the image
 * @param fallbackImage - Optional fallback image
 * @returns Image props object
 */
export function createImageProps(
  product: ProductWithImages, 
  alt: string, 
  fallbackImage?: string
): {
  src: string;
  alt: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
} {
  const primarySrc = getProductImageUrl(product, fallbackImage);
  
  return {
    src: primarySrc,
    alt,
    onError: (e) => {
      const target = e.currentTarget;
      const fallback = fallbackImage || '/images/products/default-medicine.jpg';
      
      // Try fallback image first
      if (target.src !== fallback) {
        target.src = fallback;
      } else {
        // If fallback also fails, use a data URL placeholder
        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
      }
    }
  };
}
