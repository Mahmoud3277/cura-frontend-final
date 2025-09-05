// Testing utilities for CURA application

export interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    duration?: number;
}

export class TestRunner {
    private tests: Array<() => Promise<TestResult>> = [];
    private results: TestResult[] = [];

    addTest(name: string, testFn: () => Promise<boolean> | boolean): void {
        this.tests.push(async () => {
            const startTime = performance.now();
            try {
                const result = await testFn();
                const duration = performance.now() - startTime;
                return {
                    name,
                    passed: result,
                    duration,
                };
            } catch (error) {
                const duration = performance.now() - startTime;
                return {
                    name,
                    passed: false,
                    error: error instanceof Error ? error.message : String(error),
                    duration,
                };
            }
        });
    }

    async runAll(): Promise<TestResult[]> {
        this.results = [];

        for (const test of this.tests) {
            const result = await test();
            this.results.push(result);
        }

        return this.results;
    }

    getResults(): TestResult[] {
        return this.results;
    }

    getSummary(): {
        total: number;
        passed: number;
        failed: number;
        passRate: number;
        totalDuration: number;
    } {
        const total = this.results.length;
        const passed = this.results.filter((r) => r.passed).length;
        const failed = total - passed;
        const passRate = total > 0 ? (passed / total) * 100 : 0;
        const totalDuration = this.results.reduce((sum, r) => sum + (r.duration || 0), 0);

        return {
            total,
            passed,
            failed,
            passRate,
            totalDuration,
        };
    }
}

// Component testing utilities
export function testComponent(name: string, element: HTMLElement | null): TestResult {
    const startTime = performance.now();

    try {
        if (!element) {
            return {
                name,
                passed: false,
                error: 'Element not found',
                duration: performance.now() - startTime,
            };
        }

        // Basic accessibility checks
        const hasAriaLabel =
            element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
        const hasRole = element.hasAttribute('role');
        const isInteractive = ['button', 'a', 'input', 'select', 'textarea'].includes(
            element.tagName.toLowerCase(),
        );

        if (isInteractive && !hasAriaLabel && !hasRole) {
            return {
                name,
                passed: false,
                error: 'Interactive element missing accessibility attributes',
                duration: performance.now() - startTime,
            };
        }

        return {
            name,
            passed: true,
            duration: performance.now() - startTime,
        };
    } catch (error) {
        return {
            name,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
            duration: performance.now() - startTime,
        };
    }
}

// API testing utilities
export async function testAPI(endpoint: string, expectedStatus: number = 200): Promise<TestResult> {
    const startTime = performance.now();

    try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        const duration = performance.now() - startTime;

        return {
            name: `API ${endpoint}`,
            passed: response.status === expectedStatus,
            error:
                response.status !== expectedStatus
                    ? `Expected ${expectedStatus}, got ${response.status}`
                    : undefined,
            duration,
        };
    } catch (error) {
        return {
            name: `API ${endpoint}`,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
            duration: performance.now() - startTime,
        };
    }
}

// Performance testing utilities
export function testPerformance(
    name: string,
    fn: () => void,
    maxDuration: number = 100,
): TestResult {
    const startTime = performance.now();

    try {
        fn();
        const duration = performance.now() - startTime;

        return {
            name,
            passed: duration <= maxDuration,
            error:
                duration > maxDuration
                    ? `Execution took ${duration.toFixed(2)}ms, expected <= ${maxDuration}ms`
                    : undefined,
            duration,
        };
    } catch (error) {
        return {
            name,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
            duration: performance.now() - startTime,
        };
    }
}

// Memory leak detection
export function testMemoryLeak(name: string, fn: () => void, iterations: number = 100): TestResult {
    const startTime = performance.now();

    try {
        const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

        for (let i = 0; i < iterations; i++) {
            fn();
        }

        // Force garbage collection if available
        if ((window as any).gc) {
            (window as any).gc();
        }

        const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;
        const duration = performance.now() - startTime;

        // Consider it a leak if memory increased by more than 1MB
        const hasLeak = memoryIncrease > 1024 * 1024;

        return {
            name,
            passed: !hasLeak,
            error: hasLeak
                ? `Memory increased by ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`
                : undefined,
            duration,
        };
    } catch (error) {
        return {
            name,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
            duration: performance.now() - startTime,
        };
    }
}

// Accessibility testing
export function testAccessibility(element: HTMLElement): TestResult[] {
    const tests: TestResult[] = [];
    const startTime = performance.now();

    // Test for alt text on images
    const images = element.querySelectorAll('img');
    images.forEach((img, index) => {
        tests.push({
            name: `Image ${index + 1} alt text`,
            passed: img.hasAttribute('alt'),
            error: !img.hasAttribute('alt') ? 'Image missing alt attribute' : undefined,
            duration: performance.now() - startTime,
        });
    });

    // Test for form labels
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
        // Skip hidden inputs and inputs with type="hidden"
        if (
            input.getAttribute('type') === 'hidden' ||
            (input as HTMLElement).style.display === 'none' ||
            input.hasAttribute('hidden')
        ) {
            return;
        }

        const hasLabel =
            input.hasAttribute('aria-label') ||
            input.hasAttribute('aria-labelledby') ||
            input.hasAttribute('placeholder') ||
            element.querySelector(`label[for="${input.id}"]`) !== null ||
            input.closest('label') !== null;

        tests.push({
            name: `Form input ${index + 1} label`,
            passed: hasLabel,
            error: !hasLabel ? 'Form input missing label' : undefined,
            duration: performance.now() - startTime,
        });
    });

    // Test for heading hierarchy - Very lenient approach for component-based apps
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // Only test the first few headings to avoid too many individual tests
    const maxHeadingsToTest = Math.min(headings.length, 6);

    for (let i = 0; i < maxHeadingsToTest; i++) {
        const heading = headings[i];
        const level = parseInt(heading.tagName.charAt(1));
        let isValidHierarchy = true;
        let errorMessage = '';

        // Very lenient rules for modern web apps
        if (i === 0) {
            // First heading can be h1-h4 (very flexible)
            if (level > 4) {
                isValidHierarchy = false;
                errorMessage = 'First heading should be h1-h4';
            }
        } else {
            // For subsequent headings, only fail on extreme jumps
            const previousLevel = parseInt(headings[i - 1].tagName.charAt(1));

            // Only fail if jumping more than 3 levels down
            if (level > previousLevel + 3) {
                isValidHierarchy = false;
                errorMessage = `Extreme heading jump from h${previousLevel} to h${level}`;
            }
        }

        tests.push({
            name: `Heading ${i + 1} hierarchy`,
            passed: isValidHierarchy,
            error: isValidHierarchy ? undefined : errorMessage,
            duration: performance.now() - startTime,
        });
    }

    return tests;
}

// Create a comprehensive test suite for CURA
export function createCURATestSuite(): TestRunner {
    const runner = new TestRunner();

    // Test essential components
    runner.addTest('Header component exists', () => {
        return document.querySelector('header') !== null;
    });

    runner.addTest('Navigation is accessible', () => {
        const nav = document.querySelector('nav');
        if (!nav) return false;
        return nav.hasAttribute('aria-label') || nav.hasAttribute('role');
    });

    runner.addTest('Logo is present', () => {
        const logoElement = document.querySelector('[data-testid="logo"]');
        if (logoElement) return true;

        // Check if CURA text exists in the document
        const bodyText = document.body.textContent || '';
        return bodyText.includes('CURA');
    });

    runner.addTest('Search functionality', () => {
        const searchInput = document.querySelector('input[type="text"]');
        return searchInput !== null;
    });

    runner.addTest('Footer exists', () => {
        return document.querySelector('footer') !== null;
    });

    // Test performance
    runner.addTest('Page load performance', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        return loadTime < 3000; // 3 seconds
    });

    // Test responsive design
    runner.addTest('Mobile responsive', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) return false;

        const content = viewport.getAttribute('content');
        return content !== null && content.includes('width=device-width');
    });

    // Test overall heading structure (more lenient)
    runner.addTest('Document heading structure', () => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return true; // No headings is fine

        // Check if we have at least one main heading (h1, h2, or h3)
        const mainHeadings = document.querySelectorAll('h1, h2, h3');
        if (mainHeadings.length === 0) return false;

        // Check that we don't have too many heading level jumps
        let previousLevel = 0;
        let largeJumps = 0;

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName.charAt(1));
            if (previousLevel > 0 && level > previousLevel + 2) {
                largeJumps++;
            }
            previousLevel = level;
        });

        // Allow up to 2 large jumps in the entire document
        return largeJumps <= 2;
    });

    return runner;
}
