'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const [isInView, setIsInView] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (triggerOnce) {
                        setHasTriggered(true);
                    }
                } else if (!triggerOnce && !hasTriggered) {
                    setIsInView(false);
                }
            },
            {
                threshold,
                rootMargin,
            },
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce, hasTriggered]);

    return { elementRef, isInView };
}

export function useStaggeredScrollAnimation(
    count: number,
    options: UseScrollAnimationOptions = {},
) {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
    const elementRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        elementRefs.current.forEach((element, index) => {
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisibleItems((prev) => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });
                    } else if (!triggerOnce) {
                        setVisibleItems((prev) => {
                            const newState = [...prev];
                            newState[index] = false;
                            return newState;
                        });
                    }
                },
                {
                    threshold,
                    rootMargin,
                },
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [count, threshold, rootMargin, triggerOnce]);

    const setRef = (index: number) => (element: HTMLElement | null) => {
        elementRefs.current[index] = element;
    };

    return { setRef, visibleItems };
}
