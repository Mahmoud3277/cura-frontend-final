// Comprehensive Search Service for CURA Platform
import { Product, searchProducts } from '@/lib/data/products';
import { Pharmacy, getPharmaciesInEnabledCities } from '@/lib/data/pharmacies';

export interface SearchResult {
    id: string;
    type: 'product' | 'pharmacy' | 'category' | 'condition' | 'medicine';
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    url: string;
    relevanceScore: number;
    metadata?: Record<string, any>;
}

export interface SearchFilters {
    type?: string[];
    category?: string[];
    priceRange?: { min: number; max: number };
    location?: string[];
    inStockOnly?: boolean;
    prescriptionOnly?: boolean;
    rating?: number;
    sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'distance' | 'name';
}

export interface SearchSuggestion {
    id: string;
    text: string;
    type: 'product' | 'category' | 'pharmacy' | 'condition' | 'recent';
    count?: number;
    icon?: string;
}

export interface SearchHistory {
    id: string;
    query: string;
    timestamp: Date;
    resultCount: number;
    filters?: SearchFilters;
}

class SearchService {
    private searchHistory: SearchHistory[] = [];
    private searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    private readonly MAX_CACHE_SIZE = 100;

    private popularSearches: string[] = [
        'paracetamol',
        'vitamin d',
        'blood pressure monitor',
        'baby formula',
        'sunscreen',
        'omega 3',
        'calcium',
        'insulin',
        'thermometer',
        'face cream',
    ];

    private categories = [
        { id: 'prescription', name: 'Prescription Medicines', icon: '💊' },
        { id: 'otc', name: 'Over-the-Counter', icon: '🏥' },
        { id: 'supplements', name: 'Supplements', icon: '💉' },
        { id: 'skincare', name: 'Skincare', icon: '🧴' },
        { id: 'baby', name: 'Baby Care', icon: '👶' },
        { id: 'medical', name: 'Medical Supplies', icon: '🩹' },
        { id: 'vitamins', name: 'Vitamins', icon: '🍿' },
    ];

    private conditions = [
        { id: 'diabetes', name: 'Diabetes', medicines: ['insulin', 'metformin', 'glucose strips'] },
        {
            id: 'hypertension',
            name: 'High Blood Pressure',
            medicines: ['amlodipine', 'lisinopril', 'blood pressure monitor'],
        },
        { id: 'pain', name: 'Pain Relief', medicines: ['paracetamol', 'ibuprofen', 'aspirin'] },
        {
            id: 'allergy',
            name: 'Allergies',
            medicines: ['antihistamine', 'cetirizine', 'loratadine'],
        },
        {
            id: 'cold',
            name: 'Cold & Flu',
            medicines: ['cough syrup', 'decongestant', 'throat lozenges'],
        },
        {
            id: 'skin',
            name: 'Skin Conditions',
            medicines: ['moisturizer', 'sunscreen', 'antifungal cream'],
        },
    ];

    // Main search function with caching - Only return medicines/products
    async search(
        query: string,
        filters: SearchFilters = {},
        enabledCityIds: string[] = [],
        language: 'en' | 'ar' = 'en',
    ): Promise<SearchResult[]> {
        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery) {
            return this.getPopularResults(enabledCityIds);
        }

        // Create cache key
        const cacheKey = this.createCacheKey(normalizedQuery, filters, enabledCityIds, language);

        // Check cache first
        const cached = this.searchCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.results;
        }

        const results: SearchResult[] = [];

        // Only search products/medicines - no pharmacies, categories, or conditions
        const productResults = await this.searchProducts(
            normalizedQuery,
            filters,
            enabledCityIds,
            language,
        );
        results.push(...productResults);

        // Sort by relevance and filters
        const sortedResults = this.sortResults(results, filters.sortBy || 'relevance');

        // Cache results
        this.cacheResults(cacheKey, sortedResults);

        // Add to search history
        this.addToHistory(query, sortedResults.length, filters);

        return sortedResults;
    }

    // Create cache key
    private createCacheKey(
        query: string,
        filters: SearchFilters,
        enabledCityIds: string[],
        language: string,
    ): string {
        return `${query}-${JSON.stringify(filters)}-${enabledCityIds.join(',')}-${language}`;
    }

    // Cache results with size limit
    private cacheResults(key: string, results: SearchResult[]): void {
        // Remove oldest entries if cache is full
        if (this.searchCache.size >= this.MAX_CACHE_SIZE) {
            const oldestKey = this.searchCache.keys().next().value;
            this.searchCache.delete(oldestKey);
        }

        this.searchCache.set(key, {
            results,
            timestamp: Date.now(),
        });
    }

    // Clear expired cache entries
    private clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, value] of this.searchCache.entries()) {
            if (now - value.timestamp > this.CACHE_DURATION) {
                this.searchCache.delete(key);
            }
        }
    }

    // Optimized search products with early filtering
    private async searchProducts(
        query: string,
        filters: SearchFilters,
        enabledCityIds: string[],
        language: 'en' | 'ar',
    ): Promise<SearchResult[]> {
        // Pre-filter products by enabled cities first (most restrictive filter)
        let products = searchProducts(query, language);

        if (enabledCityIds.length > 0) {
            products = products.filter((product) => enabledCityIds.includes(product.cityId));
        }

        // Apply additional filters early
        products = this.applyProductFilters(products, filters);

        // Limit results for performance (take top 20 most relevant)
        const limitedProducts = products
            .map((product) => ({
                product,
                relevanceScore: this.calculateProductRelevance(product, query),
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 20)
            .map((item) => item.product);

        return limitedProducts.map((product) => ({
            id: `product-${product.id}`,
            type: 'product' as const,
            title: language === 'ar' ? product.nameAr : product.name,
            subtitle: language === 'ar' ? product.descriptionAr : product.description,
            description: language === 'ar' ? product.descriptionAr : product.description,
            image: product.image,
            url: `/product/${product.id}`,
            relevanceScore: this.calculateProductRelevance(product, query),
            metadata: {
                price: product.price,
                rating: product.rating,
                inStock: product.availability.inStock,
                prescription: product.prescription,
                category: product.category,
            },
        }));
    }

    // Search pharmacies
    private async searchPharmacies(
        query: string,
        filters: SearchFilters,
        enabledCityIds: string[],
    ): Promise<SearchResult[]> {
        const pharmacies = getPharmaciesInEnabledCities(enabledCityIds);

        const matchingPharmacies = pharmacies.filter(
            (pharmacy) =>
                pharmacy.name.toLowerCase().includes(query) ||
                pharmacy.address.toLowerCase().includes(query) ||
                pharmacy.cityName.toLowerCase().includes(query) ||
                pharmacy.specialties.some((specialty) => specialty.toLowerCase().includes(query)),
        );

        return matchingPharmacies.map((pharmacy) => ({
            id: `pharmacy-${pharmacy.id}`,
            type: 'pharmacy' as const,
            title: pharmacy.name,
            subtitle: `${pharmacy.cityName} • ${pharmacy.rating}⭐`,
            description: pharmacy.address,
            url: `/store-locator?pharmacy=${pharmacy.id}`,
            relevanceScore: this.calculatePharmacyRelevance(pharmacy, query),
            metadata: {
                rating: pharmacy.rating,
                isOpen: pharmacy.isOpen,
                hasDelivery: pharmacy.hasDelivery,
                specialties: pharmacy.specialties,
                city: pharmacy.cityName,
            },
        }));
    }

    // Search categories
    private searchCategories(query: string): SearchResult[] {
        const matchingCategories = this.categories.filter((category) =>
            category.name.toLowerCase().includes(query),
        );

        return matchingCategories.map((category) => ({
            id: `category-${category.id}`,
            type: 'category' as const,
            title: category.name,
            subtitle: 'Product Category',
            description: `Browse all ${category.name.toLowerCase()}`,
            url: `/shop?category=${category.id}`,
            relevanceScore: this.calculateTextRelevance(category.name, query),
            metadata: {
                icon: category.icon,
                categoryId: category.id,
            },
        }));
    }

    // Search conditions
    private searchConditions(query: string): SearchResult[] {
        const matchingConditions = this.conditions.filter(
            (condition) =>
                condition.name.toLowerCase().includes(query) ||
                condition.medicines.some((medicine) => medicine.toLowerCase().includes(query)),
        );

        return matchingConditions.map((condition) => ({
            id: `condition-${condition.id}`,
            type: 'condition' as const,
            title: condition.name,
            subtitle: 'Health Condition',
            description: `Find medicines for ${condition.name.toLowerCase()}`,
            url: `/shop?condition=${condition.id}`,
            relevanceScore: this.calculateTextRelevance(condition.name, query),
            metadata: {
                medicines: condition.medicines,
                conditionId: condition.id,
            },
        }));
    }

    // Get search suggestions - Only medicines/products
    async getSuggestions(
        query: string,
        enabledCityIds: string[] = [],
    ): Promise<SearchSuggestion[]> {
        const suggestions: SearchSuggestion[] = [];
        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery) {
            // Return popular searches and recent history
            return [...this.getRecentSearches(), ...this.getPopularSuggestions()];
        }

        // Only product suggestions - no categories, pharmacies, or conditions
        const products = searchProducts(normalizedQuery, 'en').slice(0, 8);
        products.forEach((product) => {
            suggestions.push({
                id: `product-${product.id}`,
                text: product.name,
                type: 'product',
            });
        });

        return suggestions.slice(0, 8);
    }

    // Apply product filters
    private applyProductFilters(products: Product[], filters: SearchFilters): Product[] {
        return products.filter((product) => {
            // Category filter
            if (filters.category && filters.category.length > 0) {
                if (!filters.category.includes(product.category)) return false;
            }

            // Price range filter
            if (filters.priceRange) {
                if (
                    product.price < filters.priceRange.min ||
                    product.price > filters.priceRange.max
                ) {
                    return false;
                }
            }

            // Stock filter
            if (filters.inStockOnly && !product.availability.inStock) {
                return false;
            }

            // Prescription filter
            if (filters.prescriptionOnly && !product.prescription) {
                return false;
            }

            // Rating filter
            if (filters.rating && product.rating < filters.rating) {
                return false;
            }

            return true;
        });
    }

    // Calculate relevance scores
    private calculateProductRelevance(product: Product, query: string): number {
        let score = 0;
        const normalizedQuery = query.toLowerCase();

        // Exact name match
        if (product.name.toLowerCase() === normalizedQuery) score += 100;
        else if (product.name.toLowerCase().includes(normalizedQuery)) score += 80;

        // Description match
        if (product.description.toLowerCase().includes(normalizedQuery)) score += 40;

        // Tag match
        if (product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) score += 60;

        // Category match
        if (product.category.toLowerCase().includes(normalizedQuery)) score += 30;

        // Pharmacy match
        if (product.pharmacy.toLowerCase().includes(normalizedQuery)) score += 20;

        // Boost for in-stock items
        if (product.availability.inStock) score += 10;

        // Boost for high ratings
        score += product.rating * 2;

        return score;
    }

    private calculatePharmacyRelevance(pharmacy: Pharmacy, query: string): number {
        let score = 0;
        const normalizedQuery = query.toLowerCase();

        // Exact name match
        if (pharmacy.name.toLowerCase() === normalizedQuery) score += 100;
        else if (pharmacy.name.toLowerCase().includes(normalizedQuery)) score += 80;

        // Address match
        if (pharmacy.address.toLowerCase().includes(normalizedQuery)) score += 40;

        // City match
        if (pharmacy.cityName.toLowerCase().includes(normalizedQuery)) score += 30;

        // Specialty match
        if (
            pharmacy.specialties.some((specialty) =>
                specialty.toLowerCase().includes(normalizedQuery),
            )
        )
            score += 60;

        // Boost for open pharmacies
        if (pharmacy.isOpen) score += 15;

        // Boost for delivery
        if (pharmacy.hasDelivery) score += 10;

        // Boost for high ratings
        score += pharmacy.rating * 3;

        return score;
    }

    private calculateTextRelevance(text: string, query: string): number {
        const normalizedText = text.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        if (normalizedText === normalizedQuery) return 100;
        if (normalizedText.includes(normalizedQuery)) return 80;
        if (normalizedText.startsWith(normalizedQuery)) return 70;

        // Word match scoring
        const textWords = normalizedText.split(' ');
        const queryWords = normalizedQuery.split(' ');
        const matchingWords = queryWords.filter((word) =>
            textWords.some((textWord) => textWord.includes(word)),
        );

        return (matchingWords.length / queryWords.length) * 50;
    }

    // Sort results
    private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
        const sortedResults = [...results];

        switch (sortBy) {
            case 'price-low':
                return sortedResults.sort(
                    (a, b) => (a.metadata?.price || 0) - (b.metadata?.price || 0),
                );
            case 'price-high':
                return sortedResults.sort(
                    (a, b) => (b.metadata?.price || 0) - (a.metadata?.price || 0),
                );
            case 'rating':
                return sortedResults.sort(
                    (a, b) => (b.metadata?.rating || 0) - (a.metadata?.rating || 0),
                );
            case 'name':
                return sortedResults.sort((a, b) => a.title.localeCompare(b.title));
            case 'relevance':
            default:
                return sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
        }
    }

    // Get popular results for empty search
    private getPopularResults(enabledCityIds: string[]): SearchResult[] {
        const results: SearchResult[] = [];

        // Add popular categories
        this.categories.slice(0, 4).forEach((category) => {
            results.push({
                id: `popular-category-${category.id}`,
                type: 'category',
                title: category.name,
                subtitle: 'Popular Category',
                description: `Browse ${category.name.toLowerCase()}`,
                url: `/shop?category=${category.id}`,
                relevanceScore: 50,
                metadata: { icon: category.icon },
            });
        });

        // Add popular searches as suggestions
        this.popularSearches.slice(0, 6).forEach((search, index) => {
            results.push({
                id: `popular-search-${index}`,
                type: 'product',
                title: search,
                subtitle: 'Popular Search',
                description: `Search for ${search}`,
                url: `/search?q=${encodeURIComponent(search)}`,
                relevanceScore: 40 - index,
                metadata: { isPopular: true },
            });
        });

        return results;
    }

    // Search history management
    private addToHistory(query: string, resultCount: number, filters?: SearchFilters): void {
        const historyItem: SearchHistory = {
            id: Date.now().toString(),
            query,
            timestamp: new Date(),
            resultCount,
            filters,
        };

        // Remove duplicate queries
        this.searchHistory = this.searchHistory.filter((item) => item.query !== query);

        // Add to beginning
        this.searchHistory.unshift(historyItem);

        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);

        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('cura-search-history', JSON.stringify(this.searchHistory));
        }
    }

    private getRecentSearches(): SearchSuggestion[] {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cura-search-history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        }

        return this.searchHistory.slice(0, 5).map((item) => ({
            id: `recent-${item.id}`,
            text: item.query,
            type: 'recent' as const,
            count: item.resultCount,
        }));
    }

    private getPopularSuggestions(): SearchSuggestion[] {
        return this.popularSearches.slice(0, 5).map((search, index) => ({
            id: `popular-${index}`,
            text: search,
            type: 'product' as const,
        }));
    }

    // Clear search history
    clearHistory(): void {
        this.searchHistory = [];
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cura-search-history');
        }
    }

    // Clear search cache
    clearCache(): void {
        this.searchCache.clear();
        this.clearExpiredCache();
    }

    // Get cache statistics
    getCacheStats(): { size: number; maxSize: number; hitRate: number } {
        return {
            size: this.searchCache.size,
            maxSize: this.MAX_CACHE_SIZE,
            hitRate: 0, // Would need to track hits/misses for real implementation
        };
    }

    // Get search analytics
    getSearchAnalytics(): {
        totalSearches: number;
        popularQueries: { query: string; count: number }[];
        averageResultCount: number;
    } {
        const queryCount: Record<string, number> = {};
        let totalResults = 0;

        this.searchHistory.forEach((item) => {
            queryCount[item.query] = (queryCount[item.query] || 0) + 1;
            totalResults += item.resultCount;
        });

        const popularQueries = Object.entries(queryCount)
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return {
            totalSearches: this.searchHistory.length,
            popularQueries,
            averageResultCount:
                this.searchHistory.length > 0 ? totalResults / this.searchHistory.length : 0,
        };
    }
}

export const searchService = new SearchService();
