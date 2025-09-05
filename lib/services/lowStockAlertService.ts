'use client';

import { pharmacyInventoryService, InventoryItem } from './pharmacyInventoryService';
import { NotificationService } from './notificationService';

// Low stock alert configuration
export interface LowStockAlertConfig {
    id: string;
    pharmacyId: string;
    productId: number;
    alertThreshold: number; // Stock level that triggers alert
    criticalThreshold: number; // Stock level that triggers critical alert
    isEnabled: boolean;
    alertFrequency: 'immediate' | 'hourly' | 'daily'; // How often to send alerts
    lastAlertSent?: string;
    autoReorderEnabled: boolean;
    autoReorderQuantity?: number;
    preferredSupplier?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Alert history record
export interface AlertHistory {
    id: string;
    configId: string;
    productId: number;
    alertType: 'low-stock' | 'critical-stock' | 'out-of-stock' | 'auto-reorder';
    stockLevel: number;
    threshold: number;
    message: string;
    actionTaken?: string;
    resolvedAt?: string;
    createdAt: string;
}

// Alert statistics
export interface AlertStats {
    totalAlerts: number;
    activeAlerts: number;
    resolvedAlerts: number;
    criticalAlerts: number;
    autoReordersTriggered: number;
    averageResolutionTime: number; // in hours
    alertsByProduct: { productId: number; productName: string; alertCount: number }[];
    alertTrends: { date: string; alertCount: number }[];
}

// Generate mock alert configurations
const generateAlertConfigs = (pharmacyId: string): LowStockAlertConfig[] => {
    const inventoryItems = pharmacyInventoryService.getInventoryItems();

    return inventoryItems.map((item, index) => ({
        id: `alert_config_${pharmacyId}_${item.productId}`,
        pharmacyId,
        productId: item.productId,
        alertThreshold: item.minStockThreshold + 5, // Alert 5 units above minimum
        criticalThreshold: Math.max(1, Math.floor(item.minStockThreshold / 2)), // Critical at half minimum
        isEnabled: true,
        alertFrequency: index % 3 === 0 ? 'immediate' : index % 3 === 1 ? 'hourly' : 'daily',
        autoReorderEnabled: Math.random() > 0.6, // 40% have auto-reorder enabled
        autoReorderQuantity: item.reorderQuantity,
        preferredSupplier: item.supplier,
        notes: Math.random() > 0.8 ? 'Special handling required' : undefined,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    }));
};

// Generate mock alert history
const generateAlertHistory = (configs: LowStockAlertConfig[]): AlertHistory[] => {
    const history: AlertHistory[] = [];

    configs.forEach((config) => {
        // Generate 1-5 historical alerts per product
        const alertCount = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < alertCount; i++) {
            const alertTypes: AlertHistory['alertType'][] = [
                'low-stock',
                'critical-stock',
                'out-of-stock',
                'auto-reorder',
            ];
            const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
            const resolved = Math.random() > 0.3; // 70% resolved

            history.push({
                id: `alert_${config.id}_${i}`,
                configId: config.id,
                productId: config.productId,
                alertType,
                stockLevel:
                    alertType === 'out-of-stock'
                        ? 0
                        : Math.floor(Math.random() * config.alertThreshold),
                threshold:
                    alertType === 'critical-stock'
                        ? config.criticalThreshold
                        : config.alertThreshold,
                message: `${alertType.replace('-', ' ')} alert for product ${config.productId}`,
                actionTaken: resolved
                    ? ['Restocked', 'Supplier contacted', 'Auto-reorder triggered'][
                          Math.floor(Math.random() * 3)
                      ]
                    : undefined,
                resolvedAt: resolved
                    ? new Date(
                          createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000,
                      ).toISOString()
                    : undefined,
                createdAt: createdAt.toISOString(),
            });
        }
    });

    return history.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

// Low Stock Alert Service
class LowStockAlertService {
    private alertConfigs: LowStockAlertConfig[] = [];
    private alertHistory: AlertHistory[] = [];
    private pharmacyId: string;
    private listeners: Map<string, (alerts: AlertHistory[]) => void> = new Map();
    private monitoringInterval?: NodeJS.Timeout;

    constructor(pharmacyId: string = 'healthplus-ismailia') {
        this.pharmacyId = pharmacyId;
        this.alertConfigs = generateAlertConfigs(pharmacyId);
        this.alertHistory = generateAlertHistory(this.alertConfigs);
        this.startMonitoring();
    }

    // Get alert configurations
    getAlertConfigs(): LowStockAlertConfig[] {
        return [...this.alertConfigs];
    }

    // Get alert configuration by product ID
    getAlertConfigByProduct(productId: number): LowStockAlertConfig | undefined {
        return this.alertConfigs.find((config) => config.productId === productId);
    }

    // Update alert configuration
    async updateAlertConfig(
        configId: string,
        updates: Partial<LowStockAlertConfig>,
    ): Promise<boolean> {
        const configIndex = this.alertConfigs.findIndex((config) => config.id === configId);
        if (configIndex === -1) return false;

        this.alertConfigs[configIndex] = {
            ...this.alertConfigs[configIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        return true;
    }

    // Create new alert configuration
    async createAlertConfig(
        config: Omit<LowStockAlertConfig, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<LowStockAlertConfig> {
        const newConfig: LowStockAlertConfig = {
            ...config,
            id: `alert_config_${this.pharmacyId}_${config.productId}_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.alertConfigs.push(newConfig);
        return newConfig;
    }

    // Delete alert configuration
    async deleteAlertConfig(configId: string): Promise<boolean> {
        const initialLength = this.alertConfigs.length;
        this.alertConfigs = this.alertConfigs.filter((config) => config.id !== configId);
        return this.alertConfigs.length < initialLength;
    }

    // Get alert history
    getAlertHistory(filters?: {
        productId?: number;
        alertType?: AlertHistory['alertType'];
        resolved?: boolean;
        dateRange?: { start: string; end: string };
        limit?: number;
    }): AlertHistory[] {
        let filtered = [...this.alertHistory];

        if (filters) {
            if (filters.productId) {
                filtered = filtered.filter((alert) => alert.productId === filters.productId);
            }
            if (filters.alertType) {
                filtered = filtered.filter((alert) => alert.alertType === filters.alertType);
            }
            if (filters.resolved !== undefined) {
                filtered = filtered.filter((alert) =>
                    filters.resolved ? !!alert.resolvedAt : !alert.resolvedAt,
                );
            }
            if (filters.dateRange) {
                const start = new Date(filters.dateRange.start);
                const end = new Date(filters.dateRange.end);
                filtered = filtered.filter((alert) => {
                    const alertDate = new Date(alert.createdAt);
                    return alertDate >= start && alertDate <= end;
                });
            }
            if (filters.limit) {
                filtered = filtered.slice(0, filters.limit);
            }
        }

        return filtered;
    }

    // Get current active alerts
    getActiveAlerts(): AlertHistory[] {
        return this.alertHistory.filter((alert) => !alert.resolvedAt);
    }

    // Get critical alerts (out of stock or below critical threshold)
    getCriticalAlerts(): AlertHistory[] {
        return this.alertHistory.filter(
            (alert) =>
                !alert.resolvedAt &&
                (alert.alertType === 'out-of-stock' || alert.alertType === 'critical-stock'),
        );
    }

    // Resolve alert
    async resolveAlert(alertId: string, actionTaken: string): Promise<boolean> {
        const alertIndex = this.alertHistory.findIndex((alert) => alert.id === alertId);
        if (alertIndex === -1) return false;

        this.alertHistory[alertIndex].resolvedAt = new Date().toISOString();
        this.alertHistory[alertIndex].actionTaken = actionTaken;

        this.notifyListeners();
        return true;
    }

    // Check inventory and trigger alerts
    async checkInventoryAndTriggerAlerts(): Promise<void> {
        const inventoryItems = pharmacyInventoryService.getInventoryItems();
        const now = new Date();

        for (const item of inventoryItems) {
            const config = this.getAlertConfigByProduct(item.productId);
            if (!config || !config.isEnabled) continue;

            const product = pharmacyInventoryService.getProductDetails(item.productId);
            if (!product) continue;

            // Check if we should send an alert based on frequency
            if (config.lastAlertSent) {
                const lastAlert = new Date(config.lastAlertSent);
                const timeDiff = now.getTime() - lastAlert.getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);

                if (config.alertFrequency === 'hourly' && hoursDiff < 1) continue;
                if (config.alertFrequency === 'daily' && hoursDiff < 24) continue;
            }

            let alertType: AlertHistory['alertType'] | null = null;
            let threshold = 0;
            let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';

            // Determine alert type and priority
            if (item.currentStock === 0) {
                alertType = 'out-of-stock';
                threshold = 0;
                priority = 'urgent';
            } else if (item.currentStock <= config.criticalThreshold) {
                alertType = 'critical-stock';
                threshold = config.criticalThreshold;
                priority = 'high';
            } else if (item.currentStock <= config.alertThreshold) {
                alertType = 'low-stock';
                threshold = config.alertThreshold;
                priority = 'medium';
            }

            if (alertType) {
                // Create alert history record
                const alertHistory: AlertHistory = {
                    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    configId: config.id,
                    productId: item.productId,
                    alertType,
                    stockLevel: item.currentStock,
                    threshold,
                    message: `${product.name} is ${alertType === 'out-of-stock' ? 'out of stock' : alertType === 'critical-stock' ? 'critically low' : 'running low'} (${item.currentStock} remaining)`,
                    createdAt: new Date().toISOString(),
                };

                this.alertHistory.unshift(alertHistory);

                // Create notification
                await NotificationService.createNotification({
                    userId: this.pharmacyId,
                    userRole: 'pharmacy',
                    type: 'inventory',
                    priority,
                    title: `${alertType === 'out-of-stock' ? 'Out of Stock' : alertType === 'critical-stock' ? 'Critical Stock' : 'Low Stock'} Alert`,
                    message: alertHistory.message,
                    actionUrl: '/pharmacy/inventory',
                    actionLabel: 'Manage Inventory',
                    isRead: false,
                    isArchived: false,
                    data: {
                        alertId: alertHistory.id,
                        productId: item.productId,
                        stockLevel: item.currentStock,
                        threshold,
                        alertType,
                    },
                });

                // Update last alert sent time
                config.lastAlertSent = new Date().toISOString();

                // Trigger auto-reorder if enabled and stock is critical
                if (
                    config.autoReorderEnabled &&
                    alertType === 'critical-stock' &&
                    config.autoReorderQuantity
                ) {
                    await this.triggerAutoReorder(config, item);
                }

                // Play sound for urgent alerts
                if (priority === 'urgent' || priority === 'high') {
                    NotificationService.playNotificationSound(priority);
                }
            }
        }

        this.notifyListeners();
    }

    // Trigger auto-reorder
    private async triggerAutoReorder(
        config: LowStockAlertConfig,
        item: InventoryItem,
    ): Promise<void> {
        if (!config.autoReorderQuantity) return;

        const product = pharmacyInventoryService.getProductDetails(item.productId);
        if (!product) return;

        // Create auto-reorder alert
        const autoReorderAlert: AlertHistory = {
            id: `auto_reorder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            configId: config.id,
            productId: item.productId,
            alertType: 'auto-reorder',
            stockLevel: item.currentStock,
            threshold: config.criticalThreshold,
            message: `Auto-reorder triggered for ${product.name} (${config.autoReorderQuantity} units)`,
            actionTaken: `Auto-reorder placed with ${config.preferredSupplier || 'default supplier'}`,
            createdAt: new Date().toISOString(),
        };

        this.alertHistory.unshift(autoReorderAlert);

        // Create notification for auto-reorder
        await NotificationService.createNotification({
            userId: this.pharmacyId,
            userRole: 'pharmacy',
            type: 'inventory',
            priority: 'medium',
            title: 'Auto-Reorder Triggered',
            message: autoReorderAlert.message,
            actionUrl: '/pharmacy/inventory',
            actionLabel: 'View Inventory',
            isRead: false,
            isArchived: false,
            data: {
                alertId: autoReorderAlert.id,
                productId: item.productId,
                reorderQuantity: config.autoReorderQuantity,
                supplier: config.preferredSupplier,
            },
        });

        console.log(
            `Auto-reorder triggered for ${product.name}: ${config.autoReorderQuantity} units`,
        );
    }

    // Get alert statistics
    getAlertStats(): AlertStats {
        const totalAlerts = this.alertHistory.length;
        const activeAlerts = this.alertHistory.filter((alert) => !alert.resolvedAt).length;
        const resolvedAlerts = this.alertHistory.filter((alert) => !!alert.resolvedAt).length;
        const criticalAlerts = this.alertHistory.filter(
            (alert) =>
                !alert.resolvedAt &&
                (alert.alertType === 'out-of-stock' || alert.alertType === 'critical-stock'),
        ).length;
        const autoReordersTriggered = this.alertHistory.filter(
            (alert) => alert.alertType === 'auto-reorder',
        ).length;

        // Calculate average resolution time
        const resolvedAlertsWithTime = this.alertHistory.filter(
            (alert) => alert.resolvedAt && alert.createdAt,
        );
        const averageResolutionTime =
            resolvedAlertsWithTime.length > 0
                ? resolvedAlertsWithTime.reduce((sum, alert) => {
                      const created = new Date(alert.createdAt).getTime();
                      const resolved = new Date(alert.resolvedAt!).getTime();
                      return sum + (resolved - created);
                  }, 0) /
                  resolvedAlertsWithTime.length /
                  (1000 * 60 * 60) // Convert to hours
                : 0;

        // Group alerts by product
        const alertsByProduct: { [key: number]: number } = {};
        this.alertHistory.forEach((alert) => {
            alertsByProduct[alert.productId] = (alertsByProduct[alert.productId] || 0) + 1;
        });

        const alertsByProductArray = Object.entries(alertsByProduct)
            .map(([productId, count]) => {
                const product = pharmacyInventoryService.getProductDetails(parseInt(productId));
                return {
                    productId: parseInt(productId),
                    productName: product?.name || 'Unknown Product',
                    alertCount: count,
                };
            })
            .sort((a, b) => b.alertCount - a.alertCount);

        // Generate alert trends (last 7 days)
        const alertTrends: { date: string; alertCount: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayAlerts = this.alertHistory.filter((alert) =>
                alert.createdAt.startsWith(dateStr),
            ).length;

            alertTrends.push({
                date: dateStr,
                alertCount: dayAlerts,
            });
        }

        return {
            totalAlerts,
            activeAlerts,
            resolvedAlerts,
            criticalAlerts,
            autoReordersTriggered,
            averageResolutionTime,
            alertsByProduct: alertsByProductArray,
            alertTrends,
        };
    }

    // Start monitoring inventory for alerts
    startMonitoring(): void {
        // Check every 5 minutes
        this.monitoringInterval = setInterval(
            () => {
                this.checkInventoryAndTriggerAlerts();
            },
            5 * 60 * 1000,
        );

        // Initial check
        this.checkInventoryAndTriggerAlerts();

        console.log('Low stock alert monitoring started');
    }

    // Stop monitoring
    stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        console.log('Low stock alert monitoring stopped');
    }

    // Subscribe to alert updates
    subscribe(callback: (alerts: AlertHistory[]) => void): () => void {
        const id = Math.random().toString(36).substr(2, 9);
        this.listeners.set(id, callback);

        return () => {
            this.listeners.delete(id);
        };
    }

    // Notify all listeners
    private notifyListeners(): void {
        this.listeners.forEach((callback) => {
            callback([...this.alertHistory]);
        });
    }

    // Bulk resolve alerts
    async bulkResolveAlerts(alertIds: string[], actionTaken: string): Promise<number> {
        let resolvedCount = 0;

        for (const alertId of alertIds) {
            const success = await this.resolveAlert(alertId, actionTaken);
            if (success) resolvedCount++;
        }

        return resolvedCount;
    }

    // Get alerts requiring immediate attention
    getUrgentAlerts(): AlertHistory[] {
        return this.alertHistory.filter(
            (alert) => !alert.resolvedAt && alert.alertType === 'out-of-stock',
        );
    }

    // Test alert system (for demo purposes)
    async testAlertSystem(): Promise<void> {
        console.log('Testing low stock alert system...');

        // Simulate low stock condition
        const inventoryItems = pharmacyInventoryService.getInventoryItems();
        const testItem = inventoryItems[0];

        if (testItem) {
            // Temporarily set stock to trigger alert
            const originalStock = testItem.currentStock;
            testItem.currentStock = 1; // Set to very low stock

            await this.checkInventoryAndTriggerAlerts();

            // Restore original stock
            testItem.currentStock = originalStock;

            console.log('Test alert created for:', testItem.productId);
        }
    }
}

// Export singleton instance
export const lowStockAlertService = new LowStockAlertService();
