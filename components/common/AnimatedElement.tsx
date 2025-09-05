'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

interface AnimatedElementProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    animation?:
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'scale-in'
        | 'slide-up'
        | 'slide-down'
        | 'bounce-in'
        | 'rotate-in'
        | 'flip-in-x';
    delay?: number;
    duration?: number;
    threshold?: number;
    triggerOnce?: boolean;
    as?: keyof JSX.IntrinsicElements;
}

export function AnimatedElement({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 600,
    threshold = 0.1,
    triggerOnce = true,
    as: Component = 'div',
    className = '',
    style,
    ...props
}: AnimatedElementProps) {
    const { elementRef, isInView } = useScrollAnimation({ threshold, triggerOnce });

    const animationClasses = {
        'fade-up': 'scroll-fade-in',
        'fade-down': 'scroll-fade-in',
        'fade-left': 'scroll-slide-right',
        'fade-right': 'scroll-slide-left',
        'scale-in': 'scroll-scale-in',
        'slide-up': 'scroll-fade-in',
        'slide-down': 'scroll-fade-in',
        'bounce-in': 'scroll-scale-in',
        'rotate-in': 'scroll-scale-in',
        'flip-in-x': 'scroll-scale-in',
    };

    const animationClass = animationClasses[animation] || 'scroll-fade-in';

    return (
        <Component
            ref={elementRef}
            className={`${animationClass} ${isInView ? 'in-view' : ''} ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`,
                ...style,
            }}
            {...props}
            data-oid="324ar-r"
        >
            {children}
        </Component>
    );
}

export function StaggeredAnimatedList({
    children,
    animation = 'fade-up',
    staggerDelay = 100,
    initialDelay = 0,
    className = '',
    ...props
}: {
    children: ReactNode[];
    animation?: AnimatedElementProps['animation'];
    staggerDelay?: number;
    initialDelay?: number;
    className?: string;
} & HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={className} {...props} data-oid="0p.-6gh">
            {children.map((child, index) => (
                <AnimatedElement
                    key={index}
                    animation={animation}
                    delay={initialDelay + index * staggerDelay}
                    data-oid="0kh3y3n"
                >
                    {child}
                </AnimatedElement>
            ))}
        </div>
    );
}
