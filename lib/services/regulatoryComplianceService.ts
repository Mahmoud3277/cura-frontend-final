/**
 * Regulatory Compliance Service
 *
 * This service ensures strict regulatory compliance for the pharmacy management system.
 * It enforces the rule that ONLY pharmacies can sell medicines, while vendors can only
 * sell medical supplies, hygiene supplies, and medical devices.
 *
 * Key Compliance Rules:
 * 1. Vendors CANNOT sell medicines under any circumstances
 * 2. Vendors CANNOT sell prescription-required products
 * 3. Pharmacies can sell all products they are eligible for
 * 4. All product access must be logged for audit purposes
 * 5. Any violation attempts must be blocked and logged
 */

import { masterDatabaseService } from './masterDatabaseService';
import { MasterProduct } from '@/lib/database/masterProductDatabase';

export interface ComplianceViolation {
    id: string;
    timestamp: string;
    violationType:
        | 'unauthorized_medicine_access'
        | 'unauthorized_prescription_access'
        | 'invalid_business_type'
        | 'missing_permissions';
    businessId: string;
    businessType: 'pharmacy' | 'vendor';
    productId?: number;
    productName?: string;
    productType?: string;
    attemptedAction: 'view' | 'sell' | 'add_to_inventory' | 'process_order';
    userAgent?: string;
    ipAddress?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    blocked: boolean;
}

export interface ComplianceReport {
    period: {
        start: string;
        end: string;
    };
    summary: {
        totalViolations: number;
        blockedViolations: number;
        criticalViolations: number;
        businessesInViolation: string[];
    };
    violations: ComplianceViolation[];
    recommendations: string[];
}

export interface AccessAuditLog {
    id: string;
    timestamp: string;
    businessId: string;
    businessType: 'pharmacy' | 'vendor';
    productId: number;
    productName: string;
    productType: string;
    action: 'view' | 'sell' | 'add_to_inventory' | 'process_order';
    allowed: boolean;
    reason?: string;
    userAgent?: string;
    ipAddress?: string;
}

/**
 * Regulatory Compliance Service
 */
export class RegulatoryComplianceService {
    private static instance: RegulatoryComplianceService;
    private violations: ComplianceViolation[] = [];
    private auditLogs: AccessAuditLog[] = [];

    private constructor() {}

    public static getInstance(): RegulatoryComplianceService {
        if (!RegulatoryComplianceService.instance) {
            RegulatoryComplianceService.instance = new RegulatoryComplianceService();
        }
        return RegulatoryComplianceService.instance;
    }

    /**
     * Validate product access with strict compliance checking
     */
    public validateProductAccess(
        businessId: string,
        productId: number,
        action: 'view' | 'sell' | 'add_to_inventory' | 'process_order',
        context?: {
            userAgent?: string;
            ipAddress?: string;
        },
    ): {
        allowed: boolean;
        reason?: string;
        violation?: ComplianceViolation;
    } {
        const business = masterDatabaseService.getBusinessById(businessId);
        if (!business) {
            const violation = this.logViolation({
                businessId,
                businessType: 'vendor', // Default for unknown
                violationType: 'invalid_business_type',
                attemptedAction: action,
                severity: 'high',
                description: `Attempted access with invalid business ID: ${businessId}`,
                context,
            });

            return {
                allowed: false,
                reason: 'Invalid business ID',
                violation,
            };
        }

        const validation = masterDatabaseService.validateProductAccess(productId, businessId);
        const product = masterDatabaseService.getProductById(productId, business.type, businessId);

        // Log the access attempt
        this.logAccess({
            businessId,
            businessType: business.type,
            productId,
            productName: product?.name || 'Unknown',
            productType: product?.type || 'Unknown',
            action,
            allowed: validation.canAccess,
            reason: validation.reason,
            context,
        });

        if (!validation.canAccess) {
            // Determine violation type and severity
            let violationType: ComplianceViolation['violationType'] = 'missing_permissions';
            let severity: ComplianceViolation['severity'] = 'medium';

            if (business.type === 'vendor' && product?.type === 'medicine') {
                violationType = 'unauthorized_medicine_access';
                severity = 'critical';
            } else if (business.type === 'vendor' && product?.prescriptionRequired) {
                violationType = 'unauthorized_prescription_access';
                severity = 'high';
            }

            const violation = this.logViolation({
                businessId,
                businessType: business.type,
                productId,
                productName: product?.name,
                productType: product?.type,
                violationType,
                attemptedAction: action,
                severity,
                description: validation.reason || 'Access denied',
                context,
            });

            return {
                allowed: false,
                reason: validation.reason,
                violation,
            };
        }

        return {
            allowed: true,
        };
    }

    /**
     * Validate vendor medicine access (should always be blocked)
     */
    public validateVendorMedicineAccess(
        vendorId: string,
        productId: number,
        action: 'view' | 'sell' | 'add_to_inventory' | 'process_order',
    ): {
        allowed: boolean;
        violation: ComplianceViolation;
    } {
        const product = masterDatabaseService.getProductById(productId, 'pharmacy'); // Check as pharmacy to get full info

        const violation = this.logViolation({
            businessId: vendorId,
            businessType: 'vendor',
            productId,
            productName: product?.name,
            productType: product?.type,
            violationType: 'unauthorized_medicine_access',
            attemptedAction: action,
            severity: 'critical',
            description: `CRITICAL: Vendor attempted to access medicine ${product?.name || productId}`,
        });

        return {
            allowed: false,
            violation,
        };
    }

    /**
     * Log compliance violation
     */
    private logViolation(params: {
        businessId: string;
        businessType: 'pharmacy' | 'vendor';
        productId?: number;
        productName?: string;
        productType?: string;
        violationType: ComplianceViolation['violationType'];
        attemptedAction: 'view' | 'sell' | 'add_to_inventory' | 'process_order';
        severity: ComplianceViolation['severity'];
        description: string;
        context?: {
            userAgent?: string;
            ipAddress?: string;
        };
    }): ComplianceViolation {
        const violation: ComplianceViolation = {
            id: `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            violationType: params.violationType,
            businessId: params.businessId,
            businessType: params.businessType,
            productId: params.productId,
            productName: params.productName,
            productType: params.productType,
            attemptedAction: params.attemptedAction,
            userAgent: params.context?.userAgent,
            ipAddress: params.context?.ipAddress,
            severity: params.severity,
            description: params.description,
            blocked: true,
        };

        this.violations.push(violation);

        // Log to console for immediate attention
        console.error('🚨 REGULATORY COMPLIANCE VIOLATION:', violation);

        // In a real application, this would also:
        // - Send alerts to compliance team
        // - Log to external audit system
        // - Trigger security monitoring
        // - Send notifications to regulatory authorities if required

        return violation;
    }

    /**
     * Log access attempt for audit purposes
     */
    private logAccess(params: {
        businessId: string;
        businessType: 'pharmacy' | 'vendor';
        productId: number;
        productName: string;
        productType: string;
        action: 'view' | 'sell' | 'add_to_inventory' | 'process_order';
        allowed: boolean;
        reason?: string;
        context?: {
            userAgent?: string;
            ipAddress?: string;
        };
    }): void {
        const auditLog: AccessAuditLog = {
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            businessId: params.businessId,
            businessType: params.businessType,
            productId: params.productId,
            productName: params.productName,
            productType: params.productType,
            action: params.action,
            allowed: params.allowed,
            reason: params.reason,
            userAgent: params.context?.userAgent,
            ipAddress: params.context?.ipAddress,
        };

        this.auditLogs.push(auditLog);

        // Keep only last 10000 audit logs in memory
        if (this.auditLogs.length > 10000) {
            this.auditLogs = this.auditLogs.slice(-10000);
        }
    }

    /**
     * Get compliance violations
     */
    public getViolations(
        businessId?: string,
        severity?: ComplianceViolation['severity'],
        limit?: number,
    ): ComplianceViolation[] {
        let filtered = [...this.violations];

        if (businessId) {
            filtered = filtered.filter((v) => v.businessId === businessId);
        }

        if (severity) {
            filtered = filtered.filter((v) => v.severity === severity);
        }

        // Sort by timestamp (newest first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (limit) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    }

    /**
     * Get audit logs
     */
    public getAuditLogs(
        businessId?: string,
        productId?: number,
        action?: string,
        limit?: number,
    ): AccessAuditLog[] {
        let filtered = [...this.auditLogs];

        if (businessId) {
            filtered = filtered.filter((log) => log.businessId === businessId);
        }

        if (productId) {
            filtered = filtered.filter((log) => log.productId === productId);
        }

        if (action) {
            filtered = filtered.filter((log) => log.action === action);
        }

        // Sort by timestamp (newest first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (limit) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    }

    /**
     * Generate compliance report
     */
    public generateComplianceReport(startDate: string, endDate: string): ComplianceReport {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const periodViolations = this.violations.filter((v) => {
            const violationDate = new Date(v.timestamp);
            return violationDate >= start && violationDate <= end;
        });

        const totalViolations = periodViolations.length;
        const blockedViolations = periodViolations.filter((v) => v.blocked).length;
        const criticalViolations = periodViolations.filter((v) => v.severity === 'critical').length;
        const businessesInViolation = [...new Set(periodViolations.map((v) => v.businessId))];

        const recommendations: string[] = [];

        if (criticalViolations > 0) {
            recommendations.push('Immediate review required for critical violations');
            recommendations.push('Consider additional training for businesses with violations');
        }

        if (businessesInViolation.length > 0) {
            recommendations.push('Review access permissions for businesses with violations');
        }

        if (totalViolations === 0) {
            recommendations.push('No violations detected - system operating within compliance');
        }

        return {
            period: {
                start: startDate,
                end: endDate,
            },
            summary: {
                totalViolations,
                blockedViolations,
                criticalViolations,
                businessesInViolation,
            },
            violations: periodViolations,
            recommendations,
        };
    }

    /**
     * Check system compliance status
     */
    public getComplianceStatus(): {
        status: 'compliant' | 'warning' | 'violation';
        recentViolations: number;
        criticalViolations: number;
        lastViolation?: string;
        message: string;
    } {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentViolations = this.violations.filter(
            (v) => new Date(v.timestamp) >= last24Hours,
        ).length;

        const criticalViolations = this.violations.filter(
            (v) => new Date(v.timestamp) >= last24Hours && v.severity === 'critical',
        ).length;

        const lastViolation =
            this.violations.length > 0
                ? this.violations[this.violations.length - 1].timestamp
                : undefined;

        let status: 'compliant' | 'warning' | 'violation' = 'compliant';
        let message = 'System is operating within regulatory compliance';

        if (criticalViolations > 0) {
            status = 'violation';
            message = `${criticalViolations} critical violations detected in the last 24 hours`;
        } else if (recentViolations > 5) {
            status = 'warning';
            message = `${recentViolations} violations detected in the last 24 hours`;
        }

        return {
            status,
            recentViolations,
            criticalViolations,
            lastViolation,
            message,
        };
    }

    /**
     * Clear old violations and audit logs
     */
    public clearOldRecords(olderThanDays: number = 90): {
        violationsCleared: number;
        auditLogsCleared: number;
    } {
        const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

        const initialViolations = this.violations.length;
        const initialAuditLogs = this.auditLogs.length;

        this.violations = this.violations.filter((v) => new Date(v.timestamp) >= cutoffDate);
        this.auditLogs = this.auditLogs.filter((log) => new Date(log.timestamp) >= cutoffDate);

        return {
            violationsCleared: initialViolations - this.violations.length,
            auditLogsCleared: initialAuditLogs - this.auditLogs.length,
        };
    }
}

// Export singleton instance
export const regulatoryComplianceService = RegulatoryComplianceService.getInstance();

// Utility functions
export const validateProductAccess = (
    businessId: string,
    productId: number,
    action: 'view' | 'sell' | 'add_to_inventory' | 'process_order',
) => {
    return regulatoryComplianceService.validateProductAccess(businessId, productId, action);
};

export const getComplianceStatus = () => {
    return regulatoryComplianceService.getComplianceStatus();
};

export const generateComplianceReport = (startDate: string, endDate: string) => {
    return regulatoryComplianceService.generateComplianceReport(startDate, endDate);
};
