import { MasterProduct } from '@/lib/database/masterProductDatabase';

export interface ProductValidationRule {
    field: string;
    required: boolean;
    validator?: (value: any, product: MasterProduct) => boolean;
    message: string;
    suggestion: string;
    severity: 'critical' | 'warning' | 'info';
    category?: string[];
}

export interface ProductIssue {
    productId: number;
    productName: string;
    category: string;
    severity: 'critical' | 'warning' | 'info';
    type: 'missing_data' | 'inconsistent_data' | 'validation_error' | 'recommendation';
    field: string;
    message: string;
    suggestion?: string;
    currentValue?: any;
    expectedValue?: any;
}

export class ProductAnalysisService {
    private static instance: ProductAnalysisService;
    private validationRules: ProductValidationRule[] = [];

    private constructor() {
        this.initializeValidationRules();
    }

    public static getInstance(): ProductAnalysisService {
        if (!ProductAnalysisService.instance) {
            ProductAnalysisService.instance = new ProductAnalysisService();
        }
        return ProductAnalysisService.instance;
    }

    private initializeValidationRules(): void {
        this.validationRules = [
            // Critical validations
            {
                field: 'name',
                required: true,
                message: 'Product name is missing',
                suggestion: 'Add a descriptive product name',
                severity: 'critical',
            },
            {
                field: 'manufacturer',
                required: true,
                message: 'Manufacturer information is missing',
                suggestion: 'Add manufacturer details for regulatory compliance',
                severity: 'critical',
            },
            {
                field: 'category',
                required: true,
                message: 'Product category is missing',
                suggestion: 'Assign product to appropriate category',
                severity: 'critical',
            },
            {
                field: 'type',
                required: true,
                message: 'Product type is missing',
                suggestion: 'Define product type (medicine, medical-supply, etc.)',
                severity: 'critical',
            },

            // Medicine-specific critical validations
            {
                field: 'activeIngredient',
                required: false,
                validator: (value: any, product: MasterProduct) => {
                    if (product.type === 'medicine') {
                        return value && value.trim() !== '';
                    }
                    return true;
                },
                message: 'Active ingredient is missing for medicine',
                suggestion: 'Add active ingredient information for medicines',
                severity: 'critical',
                category: ['medicine'],
            },
            {
                field: 'dosage',
                required: false,
                validator: (value: any, product: MasterProduct) => {
                    if (product.type === 'medicine') {
                        return value && value.trim() !== '';
                    }
                    return true;
                },
                message: 'Dosage information is missing for medicine',
                suggestion: 'Add dosage/strength information for medicines',
                severity: 'critical',
                category: ['medicine'],
            },

            // Consistency validations
            {
                field: 'pharmacyEligible',
                required: false,
                validator: (value: any, product: MasterProduct) => {
                    if (product.type === 'medicine') {
                        return value === true;
                    }
                    return true;
                },
                message: 'Medicine should be pharmacy eligible',
                suggestion: 'Set pharmacyEligible to true for medicines',
                severity: 'critical',
            },
            {
                field: 'vendorEligible',
                required: false,
                validator: (value: any, product: MasterProduct) => {
                    if (product.type === 'medicine') {
                        return value === false;
                    }
                    return true;
                },
                message: 'Medicines cannot be vendor eligible',
                suggestion: 'Set vendorEligible to false for medicines',
                severity: 'critical',
            },

            // Warning level validations
            {
                field: 'nameAr',
                required: false,
                validator: (value: any) => value && value.trim() !== '',
                message: 'Arabic name is missing',
                suggestion: 'Add Arabic translation for better accessibility',
                severity: 'warning',
            },
            {
                field: 'description',
                required: false,
                validator: (value: any) => value && value.trim() !== '',
                message: 'Product description is missing',
                suggestion: 'Add detailed product description',
                severity: 'warning',
            },
            {
                field: 'image',
                required: false,
                validator: (value: any) => {
                    if (!value || value.trim() === '') return false;
                    try {
                        new URL(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                message: 'Product image is missing or invalid',
                suggestion: 'Add valid product image URL',
                severity: 'warning',
            },
            {
                field: 'registrationNumber',
                required: false,
                validator: (value: any, product: MasterProduct) => {
                    if (product.type === 'medicine') {
                        return value && value.trim() !== '';
                    }
                    return value && value.trim() !== '';
                },
                message: 'Registration number is missing',
                suggestion: 'Add regulatory registration number for compliance',
                severity: 'warning',
            },
            {
                field: 'packSize',
                required: false,
                validator: (value: any) => value && value.trim() !== '',
                message: 'Pack size information is missing',
                suggestion: 'Add pack size details for inventory management',
                severity: 'warning',
            },
            {
                field: 'form',
                required: false,
                validator: (value: any, product: MasterProduct) => {
                    if (product.type === 'medicine') {
                        return value && value.trim() !== '';
                    }
                    return true;
                },
                message: 'Medicine form is missing',
                suggestion: 'Add form information (tablet, capsule, etc.)',
                severity: 'warning',
                category: ['medicine'],
            },

            // Info level validations
            {
                field: 'descriptionAr',
                required: false,
                validator: (value: any) => value && value.trim() !== '',
                message: 'Arabic description is missing',
                suggestion: 'Add Arabic description for better user experience',
                severity: 'info',
            },
            {
                field: 'barcode',
                required: false,
                validator: (value: any) => value && value.trim() !== '',
                message: 'Barcode is missing',
                suggestion: 'Add barcode for inventory management',
                severity: 'info',
            },
            {
                field: 'tags',
                required: false,
                validator: (value: any) => value && Array.isArray(value) && value.length > 0,
                message: 'Product tags are missing',
                suggestion: 'Add relevant tags for better searchability',
                severity: 'info',
            },
            {
                field: 'keywords',
                required: false,
                validator: (value: any) => value && Array.isArray(value) && value.length > 0,
                message: 'Search keywords are missing',
                suggestion: 'Add search keywords for better discoverability',
                severity: 'info',
            },
        ];
    }

    public analyzeProduct(product: MasterProduct): ProductIssue[] {
        const issues: ProductIssue[] = [];

        for (const rule of this.validationRules) {
            // Skip category-specific rules if they don't apply
            if (rule.category && !rule.category.includes(product.type)) {
                continue;
            }

            const fieldValue = (product as any)[rule.field];
            let isValid = true;

            // Check required fields
            if (rule.required) {
                isValid = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
            }

            // Check custom validator
            if (isValid && rule.validator) {
                isValid = rule.validator(fieldValue, product);
            }

            if (!isValid) {
                issues.push({
                    productId: product.id,
                    productName: product.name || 'Unknown Product',
                    category: product.category,
                    severity: rule.severity,
                    type: this.getIssueType(rule),
                    field: rule.field,
                    message: rule.message,
                    suggestion: rule.suggestion,
                    currentValue: fieldValue,
                });
            }
        }

        return issues;
    }

    private getIssueType(rule: ProductValidationRule): ProductIssue['type'] {
        if (rule.field.includes('Eligible') || rule.validator) {
            return 'inconsistent_data';
        }
        if (rule.required) {
            return 'missing_data';
        }
        if (rule.severity === 'info') {
            return 'recommendation';
        }
        return 'validation_error';
    }

    public analyzeProducts(products: MasterProduct[]): {
        issues: ProductIssue[];
        stats: {
            totalProducts: number;
            productsWithIssues: number;
            criticalIssues: number;
            warnings: number;
            recommendations: number;
            completionRate: number;
            issuesByCategory: Record<string, number>;
            issuesByField: Record<string, number>;
        };
    } {
        const allIssues: ProductIssue[] = [];

        products.forEach((product) => {
            const productIssues = this.analyzeProduct(product);
            allIssues.push(...productIssues);
        });

        const totalProducts = products.length;
        const productsWithIssues = new Set(allIssues.map((issue) => issue.productId)).size;
        const criticalIssues = allIssues.filter((issue) => issue.severity === 'critical').length;
        const warnings = allIssues.filter((issue) => issue.severity === 'warning').length;
        const recommendations = allIssues.filter((issue) => issue.severity === 'info').length;
        const completionRate = Math.round(
            ((totalProducts - productsWithIssues) / totalProducts) * 100,
        );

        // Group issues by category
        const issuesByCategory: Record<string, number> = {};
        allIssues.forEach((issue) => {
            issuesByCategory[issue.category] = (issuesByCategory[issue.category] || 0) + 1;
        });

        // Group issues by field
        const issuesByField: Record<string, number> = {};
        allIssues.forEach((issue) => {
            issuesByField[issue.field] = (issuesByField[issue.field] || 0) + 1;
        });

        return {
            issues: allIssues,
            stats: {
                totalProducts,
                productsWithIssues,
                criticalIssues,
                warnings,
                recommendations,
                completionRate,
                issuesByCategory,
                issuesByField,
            },
        };
    }

    public getProductsWithCriticalIssues(products: MasterProduct[]): MasterProduct[] {
        return products.filter((product) => {
            const issues = this.analyzeProduct(product);
            return issues.some((issue) => issue.severity === 'critical');
        });
    }

    public getProductsByIssueType(
        products: MasterProduct[],
        issueType: ProductIssue['type'],
    ): MasterProduct[] {
        return products.filter((product) => {
            const issues = this.analyzeProduct(product);
            return issues.some((issue) => issue.type === issueType);
        });
    }

    public generateFixSuggestions(product: MasterProduct): {
        field: string;
        currentValue: any;
        suggestedValue: any;
        reason: string;
    }[] {
        const suggestions: {
            field: string;
            currentValue: any;
            suggestedValue: any;
            reason: string;
        }[] = [];

        const issues = this.analyzeProduct(product);

        issues.forEach((issue) => {
            switch (issue.field) {
                case 'pharmacyEligible':
                    if (product.type === 'medicine' && !product.pharmacyEligible) {
                        suggestions.push({
                            field: 'pharmacyEligible',
                            currentValue: product.pharmacyEligible,
                            suggestedValue: true,
                            reason: 'All medicines should be available through pharmacies',
                        });
                    }
                    break;
                case 'vendorEligible':
                    if (product.type === 'medicine' && product.vendorEligible) {
                        suggestions.push({
                            field: 'vendorEligible',
                            currentValue: product.vendorEligible,
                            suggestedValue: false,
                            reason: 'Medicines cannot be sold by vendors for regulatory compliance',
                        });
                    }
                    break;
                case 'nameAr':
                    if (!product.nameAr && product.name) {
                        suggestions.push({
                            field: 'nameAr',
                            currentValue: product.nameAr,
                            suggestedValue: `[Arabic translation of: ${product.name}]`,
                            reason: 'Arabic names improve accessibility for Arabic-speaking users',
                        });
                    }
                    break;
            }
        });

        return suggestions;
    }

    public exportIssuesReport(issues: ProductIssue[]): string {
        const headers = [
            'Product ID',
            'Product Name',
            'Category',
            'Severity',
            'Field',
            'Issue',
            'Suggestion',
        ];
        const rows = issues.map((issue) => [
            issue.productId.toString(),
            issue.productName,
            issue.category,
            issue.severity,
            issue.field,
            issue.message,
            issue.suggestion || '',
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n');

        return csvContent;
    }
}

// Export singleton instance
export const productAnalysisService = ProductAnalysisService.getInstance();
