import { useEffect, useCallback, useRef, useState } from 'react';
import { PerformanceMonitor } from '@/lib/utils/performance';

export function usePerformance(componentName: string) {
    const monitor = useRef(PerformanceMonitor.getInstance());
    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current += 1;
        monitor.current.startMeasure(`${componentName}-render`);

        return () => {
            monitor.current.endMeasure(`${componentName}-render`);
        };
    });

    const measureFunction = useCallback(
        (name: string, fn: () => void) => {
            monitor.current.startMeasure(`${componentName}-${name}`);
            fn();
            monitor.current.endMeasure(`${componentName}-${name}`);
        },
        [componentName],
    );

    const getMetrics = useCallback(() => {
        return monitor.current.getMetrics();
    }, []);

    return {
        measureFunction,
        getMetrics,
        renderCount: renderCount.current,
    };
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
    const throttledCallback = useRef<T>();
    const lastRan = useRef<number>();

    useEffect(() => {
        throttledCallback.current = callback;
    });

    return useCallback(
        ((...args) => {
            if (lastRan.current === undefined) {
                throttledCallback.current?.(...args);
                lastRan.current = Date.now();
            } else {
                clearTimeout(lastRan.current);
                lastRan.current = setTimeout(
                    () => {
                        if (Date.now() - lastRan.current! >= delay) {
                            throttledCallback.current?.(...args);
                            lastRan.current = Date.now();
                        }
                    },
                    delay - (Date.now() - lastRan.current),
                );
            }
        }) as T,
        [delay],
    );
}

export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    options?: IntersectionObserverInit,
) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                rootMargin: '50px',
                threshold: 0.1,
                ...options,
            },
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [elementRef, options]);

    return isIntersecting;
}
