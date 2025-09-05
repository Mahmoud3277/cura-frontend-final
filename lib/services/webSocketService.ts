// WebSocket Service for Real-time Updates
export class WebSocketService {
    private static instance: WebSocketService;
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectInterval = 5000;
    private listeners: Map<string, Function[]> = new Map();

    private constructor() {}

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect(url?: string): void {
        // In a real implementation, this would connect to your WebSocket server
        // For now, we'll simulate real-time updates with intervals
        this.simulateRealTimeUpdates();
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    public subscribe(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    public unsubscribe(event: string, callback: Function): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach((callback) => callback(data));
        }
    }

    // Simulate real-time updates for demo purposes
    private simulateRealTimeUpdates(): void {
        // Simulate prescription status updates every 30 seconds
        setInterval(() => {
            this.emit('prescription_updated', {
                type: 'status_change',
                prescriptionId: `RX-${Date.now()}`,
                newStatus: 'reviewing',
                timestamp: new Date(),
                message: 'Prescription status updated',
            });
        }, 30000);

        // Simulate new prescription submissions every 45 seconds
        setInterval(() => {
            this.emit('prescription_created', {
                type: 'new_prescription',
                prescriptionId: `RX-${Date.now()}`,
                customerName: 'New Customer',
                urgency: 'normal',
                timestamp: new Date(),
                message: 'New prescription submitted',
            });
        }, 45000);

        // Simulate prescription reader activity every 60 seconds
        setInterval(() => {
            this.emit('prescription_reader_activity', {
                type: 'reader_activity',
                readerId: 'reader-1',
                activity: 'processing',
                prescriptionId: `RX-${Date.now()}`,
                timestamp: new Date(),
                message: 'Prescription reader is processing a prescription',
            });
        }, 60000);
    }
}

// Export singleton instance
export const webSocketService = WebSocketService.getInstance();

// Real-time notification types
export interface PrescriptionNotification {
    type: 'status_change' | 'new_prescription' | 'reader_activity' | 'order_placed';
    prescriptionId: string;
    timestamp: Date;
    message: string;
    data?: any;
}

// Real-time prescription updates hook
export const usePrescriptionUpdates = (
    callback: (notification: PrescriptionNotification) => void,
) => {
    const handleUpdate = (data: any) => {
        callback(data as PrescriptionNotification);
    };

    // Subscribe to all prescription-related events
    webSocketService.subscribe('prescription_updated', handleUpdate);
    webSocketService.subscribe('prescription_created', handleUpdate);
    webSocketService.subscribe('prescription_reader_activity', handleUpdate);

    // Cleanup function
    return () => {
        webSocketService.unsubscribe('prescription_updated', handleUpdate);
        webSocketService.unsubscribe('prescription_created', handleUpdate);
        webSocketService.unsubscribe('prescription_reader_activity', handleUpdate);
    };
};
