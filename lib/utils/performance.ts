// Performance utilities for CURA application

// Debounce function for search and input optimization
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean,
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };

        const callNow = immediate && !timeout;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func(...args);
    };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Lazy loading utility for images
export function createIntersectionObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit,
): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return null;
    }

    return new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
    });
}

// Memory management for large lists
export function createVirtualizedList<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    scrollTop: number,
): {
    visibleItems: T[];
    startIndex: number;
    endIndex: number;
    totalHeight: number;
    offsetY: number;
} {
    const totalHeight = items.length * itemHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return {
        visibleItems,
        startIndex,
        endIndex,
        totalHeight,
        offsetY,
    };
}

// Performance monitoring
export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, number[]> = new Map();

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    startMeasure(name: string): void {
        if (typeof window !== 'undefined' && window.performance) {
            performance.mark(`${name}-start`);
        }
    }

    endMeasure(name: string): number | null {
        if (typeof window !== 'undefined' && window.performance) {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);

            const measure = performance.getEntriesByName(name, 'measure')[0];
            const duration = measure?.duration || 0;

            // Store metric
            if (!this.metrics.has(name)) {
                this.metrics.set(name, []);
            }
            this.metrics.get(name)!.push(duration);

            // Clean up
            performance.clearMarks(`${name}-start`);
            performance.clearMarks(`${name}-end`);
            performance.clearMeasures(name);

            return duration;
        }
        return null;
    }

    getAverageTime(name: string): number {
        const times = this.metrics.get(name) || [];
        if (times.length === 0) return 0;
        return times.reduce((sum, time) => sum + time, 0) / times.length;
    }

    getMetrics(): Record<string, { average: number; count: number; latest: number }> {
        const result: Record<string, { average: number; count: number; latest: number }> = {};

        for (const [name, times] of this.metrics.entries()) {
            result[name] = {
                average: this.getAverageTime(name),
                count: times.length,
                latest: times[times.length - 1] || 0,
            };
        }

        return result;
    }

    clearMetrics(): void {
        this.metrics.clear();
    }
}

// Bundle size analyzer (development only)
export function analyzeBundleSize(): void {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        // Analyze loaded scripts
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const totalSize = scripts.reduce((size, script) => {
            const src = (script as HTMLScriptElement).src;
            if (src.includes('_next/static')) {
                // Estimate size based on URL (rough approximation)
                return size + 1;
            }
            return size;
        }, 0);

        console.log(`Estimated bundle count: ${totalSize} chunks`);
        console.log(
            'Scripts loaded:',
            scripts.map((s) => (s as HTMLScriptElement).src),
        );
    }
}

// Memory usage monitoring
export function getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
} | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory;
        return {
            used: Math.round(memory.usedJSHeapSize / 1048576), // MB
            total: Math.round(memory.totalJSHeapSize / 1048576), // MB
            percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
        };
    }
    return null;
}

// Image optimization helper
export function getOptimizedImageUrl(
    src: string,
    width: number,
    height?: number,
    quality: number = 75,
): string {
    if (src.startsWith('/api/placeholder')) {
        return src;
    }

    // For Next.js Image optimization
    const params = new URLSearchParams({
        url: src,
        w: width.toString(),
        q: quality.toString(),
    });

    if (height) {
        params.set('h', height.toString());
    }

    return `/_next/image?${params.toString()}`;
}

// Preload critical resources
export function preloadCriticalResources(): void {
    if (typeof window === 'undefined') return;

    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Preload critical images
    const heroImage = new Image();
    heroImage.src = '/images/hero-bg.webp';

    // Preload critical API endpoints
    if ('fetch' in window) {
        fetch('/api/cities', { method: 'HEAD' }).catch(() => {});
        fetch('/api/products', { method: 'HEAD' }).catch(() => {});
    }
}

// Service Worker registration for caching
export function registerServiceWorker(): void {
    if (
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        process.env.NODE_ENV === 'production'
    ) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}
