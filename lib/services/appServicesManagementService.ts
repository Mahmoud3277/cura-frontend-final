'use client';

import { NotificationService } from './notificationService';
import { suspendedOrderService } from './suspendedOrderService';
import { SuspendedPrescriptionService } from './suspendedPrescriptionService';
import { orderMonitoringService } from './orderMonitoringService';

export interface AppServicesAgent {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'busy' | 'break';
    specializations: string[];
    currentCaseLoad: number;
    maxCaseLoad: number;
    performanceMetrics: {
        totalCasesHandled: number;
        averageResolutionTime: number; // in hours
        customerSatisfactionRating: number;
        escalationRate: number;
        firstContactResolutionRate: number;
    };
    workingHours: {
        start: string;
        end: string;
        timezone: string;
    };
    languages: string[];
    createdAt: string;
    lastActive: string;
}

export interface CustomerServiceTicket {
    id: string;
    ticketNumber: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    type: 'order' | 'prescription' | 'payment' | 'delivery' | 'general' | 'complaint' | 'refund';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    status:
        | 'open'
        | 'in-progress'
        | 'waiting-customer'
        | 'waiting-pharmacy'
        | 'waiting-vendor'
        | 'resolved'
        | 'closed';
    subject: string;
    description: string;
    assignedAgentId?: string;
    assignedAgentName?: string;
    relatedOrderId?: string;
    relatedPrescriptionId?: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    resolutionTime?: number; // in minutes
    customerSatisfactionRating?: number;
    tags: string[];
    attachments: string[];
    conversationHistory: TicketMessage[];
    escalationHistory: TicketEscalation[];
    internalNotes: string[];
}

export interface TicketMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'customer' | 'agent' | 'system';
    message: string;
    timestamp: string;
    attachments?: string[];
    isInternal: boolean;
}

export interface TicketEscalation {
    id: string;
    escalatedBy: string;
    escalatedTo: string;
    reason: string;
    timestamp: string;
    level: number;
}

export interface PharmacyCoordinationTask {
    id: string;
    pharmacyId: string;
    pharmacyName: string;
    taskType: 'inventory-check' | 'order-transfer' | 'issue-resolution' | 'performance-review';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    description: string;
    assignedAgentId: string;
    relatedOrderId?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    notes: string[];
}

export interface OrderModificationRequest {
    id: string;
    orderId: string;
    customerId: string;
    requestType:
        | 'add-item'
        | 'remove-item'
        | 'change-quantity'
        | 'change-pharmacy'
        | 'cancel-order';
    requestedBy: 'customer' | 'agent' | 'pharmacy';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    details: {
        items?: Array<{
            productId: string;
            action: 'add' | 'remove' | 'modify';
            quantity?: number;
            reason?: string;
        }>;
        newPharmacyId?: string;
        cancellationReason?: string;
    };
    approvedBy?: string;
    processedBy?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    notes: string[];
}

export interface AppServicesAnalytics {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number;
    customerSatisfactionScore: number;
    firstContactResolutionRate: number;
    escalationRate: number;
    agentPerformance: Array<{
        agentId: string;
        agentName: string;
        ticketsHandled: number;
        averageResolutionTime: number;
        customerSatisfaction: number;
        escalationRate: number;
    }>;
    ticketsByCategory: Record<string, number>;
    ticketsByPriority: Record<string, number>;
    resolutionTrends: Array<{
        date: string;
        resolved: number;
        created: number;
    }>;
    pharmacyCoordinationMetrics: {
        totalTasks: number;
        completedTasks: number;
        averageCompletionTime: number;
        pharmacyResponseRate: number;
    };
}

class AppServicesManagementService {
    private agents: AppServicesAgent[] = [
        {
            id: 'agent-001',
            name: 'Sarah Ahmed',
            email: 'sarah.ahmed@cura-platform.com',
            phone: '+20 100 111 2222',
            status: 'active',
            specializations: ['order-issues', 'prescription-problems', 'customer-complaints'],
            currentCaseLoad: 8,
            maxCaseLoad: 15,
            performanceMetrics: {
                totalCasesHandled: 234,
                averageResolutionTime: 3.2,
                customerSatisfactionRating: 4.7,
                escalationRate: 8.5,
                firstContactResolutionRate: 78.2,
            },
            workingHours: {
                start: '09:00',
                end: '17:00',
                timezone: 'Africa/Cairo',
            },
            languages: ['Arabic', 'English'],
            createdAt: '2023-10-01T08:00:00Z',
            lastActive: new Date().toISOString(),
        },
        {
            id: 'agent-002',
            name: 'Mohamed Hassan',
            email: 'mohamed.hassan@cura-platform.com',
            phone: '+20 101 222 3333',
            status: 'active',
            specializations: ['pharmacy-coordination', 'inventory-issues', 'order-modifications'],
            currentCaseLoad: 12,
            maxCaseLoad: 15,
            performanceMetrics: {
                totalCasesHandled: 189,
                averageResolutionTime: 4.1,
                customerSatisfactionRating: 4.5,
                escalationRate: 12.3,
                firstContactResolutionRate: 72.8,
            },
            workingHours: {
                start: '10:00',
                end: '18:00',
                timezone: 'Africa/Cairo',
            },
            languages: ['Arabic', 'English'],
            createdAt: '2023-11-15T08:00:00Z',
            lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
    ];

    private tickets: CustomerServiceTicket[] = [
        {
            id: 'ticket-001',
            ticketNumber: 'CS-2024-001',
            customerId: 'customer-001',
            customerName: 'Ahmed Hassan',
            customerPhone: '+20 100 123 4567',
            customerEmail: 'ahmed.hassan@email.com',
            type: 'order',
            priority: 'high',
            status: 'open',
            subject: 'Order delivery delay',
            description:
                "My order was supposed to be delivered 2 hours ago but I haven't received it yet. Order number: CURA-240115-001",
            relatedOrderId: 'order-001',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            tags: ['delivery', 'delay', 'urgent'],
            attachments: [],
            conversationHistory: [
                {
                    id: 'msg-001',
                    senderId: 'customer-001',
                    senderName: 'Ahmed Hassan',
                    senderType: 'customer',
                    message:
                        "My order was supposed to be delivered 2 hours ago but I haven't received it yet.",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    isInternal: false,
                },
            ],
            escalationHistory: [],
            internalNotes: [],
        },
        {
            id: 'ticket-002',
            ticketNumber: 'CS-2024-002',
            customerId: 'customer-002',
            customerName: 'Fatima Ali',
            customerPhone: '+20 101 234 5678',
            customerEmail: 'fatima.ali@email.com',
            type: 'prescription',
            priority: 'urgent',
            status: 'in-progress',
            subject: 'Prescription reading error',
            description:
                'The prescription reader made an error in reading my prescription. Wrong medicine was suggested.',
            assignedAgentId: 'agent-001',
            assignedAgentName: 'Sarah Ahmed',
            relatedPrescriptionId: 'prescription-001',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            tags: ['prescription', 'error', 'medicine', 'urgent'],
            attachments: ['prescription-image.jpg'],
            conversationHistory: [
                {
                    id: 'msg-002',
                    senderId: 'customer-002',
                    senderName: 'Fatima Ali',
                    senderType: 'customer',
                    message:
                        'The prescription reader made an error in reading my prescription. Wrong medicine was suggested.',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    isInternal: false,
                },
                {
                    id: 'msg-003',
                    senderId: 'agent-001',
                    senderName: 'Sarah Ahmed',
                    senderType: 'agent',
                    message:
                        'I understand your concern. Let me review your prescription and coordinate with our prescription reading team to correct this error.',
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    isInternal: false,
                },
            ],
            escalationHistory: [],
            internalNotes: [
                'Customer uploaded clear prescription image',
                'Coordinating with prescription reading team',
            ],
        },
    ];

    private pharmacyTasks: PharmacyCoordinationTask[] = [
        {
            id: 'task-001',
            pharmacyId: 'healthplus-ismailia',
            pharmacyName: 'HealthPlus Pharmacy',
            taskType: 'inventory-check',
            priority: 'high',
            status: 'pending',
            description: 'Check availability of Insulin pen for urgent customer order',
            assignedAgentId: 'agent-002',
            relatedOrderId: 'suspended-002',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            notes: [],
        },
    ];

    // Get all agents
    getAgents(): AppServicesAgent[] {
        return [...this.agents];
    }

    // Get agent by ID
    getAgentById(id: string): AppServicesAgent | undefined {
        return this.agents.find((agent) => agent.id === id);
    }

    // Get available agents for assignment
    getAvailableAgents(): AppServicesAgent[] {
        return this.agents.filter(
            (agent) => agent.status === 'active' && agent.currentCaseLoad < agent.maxCaseLoad,
        );
    }

    // Create new customer service ticket
    async createTicket(ticketData: Partial<CustomerServiceTicket>): Promise<CustomerServiceTicket> {
        const newTicket: CustomerServiceTicket = {
            id: `ticket-${Date.now()}`,
            ticketNumber: `CS-${new Date().getFullYear()}-${String(this.tickets.length + 1).padStart(3, '0')}`,
            customerId: ticketData.customerId || '',
            customerName: ticketData.customerName || '',
            customerPhone: ticketData.customerPhone || '',
            customerEmail: ticketData.customerEmail || '',
            type: ticketData.type || 'general',
            priority: ticketData.priority || 'normal',
            status: 'open',
            subject: ticketData.subject || '',
            description: ticketData.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ticketData.tags || [],
            attachments: ticketData.attachments || [],
            conversationHistory: [],
            escalationHistory: [],
            internalNotes: [],
        };

        // Auto-assign to available agent if possible
        const availableAgent = this.getAvailableAgents()[0];
        if (availableAgent) {
            newTicket.assignedAgentId = availableAgent.id;
            newTicket.assignedAgentName = availableAgent.name;
            newTicket.status = 'in-progress';
            availableAgent.currentCaseLoad++;
        }

        this.tickets.unshift(newTicket);

        // Create notification
        await NotificationService.createNotification({
            userId: 'app-services',
            userRole: 'admin',
            type: 'system',
            priority: newTicket.priority === 'urgent' ? 'urgent' : 'high',
            title: 'New Customer Service Ticket',
            message: `New ${newTicket.type} ticket created: ${newTicket.subject}`,
            actionUrl: '/app-services/dashboard',
            actionLabel: 'View Ticket',
            isRead: false,
            isArchived: false,
            data: { ticketId: newTicket.id },
        });

        return newTicket;
    }

    // Get all tickets with filtering
    getTickets(filters?: {
        status?: string[];
        type?: string[];
        priority?: string[];
        assignedAgentId?: string;
        customerId?: string;
        search?: string;
    }): CustomerServiceTicket[] {
        let filtered = [...this.tickets];

        if (filters) {
            if (filters.status && filters.status.length > 0) {
                filtered = filtered.filter((ticket) => filters.status!.includes(ticket.status));
            }
            if (filters.type && filters.type.length > 0) {
                filtered = filtered.filter((ticket) => filters.type!.includes(ticket.type));
            }
            if (filters.priority && filters.priority.length > 0) {
                filtered = filtered.filter((ticket) => filters.priority!.includes(ticket.priority));
            }
            if (filters.assignedAgentId) {
                filtered = filtered.filter(
                    (ticket) => ticket.assignedAgentId === filters.assignedAgentId,
                );
            }
            if (filters.customerId) {
                filtered = filtered.filter((ticket) => ticket.customerId === filters.customerId);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                filtered = filtered.filter(
                    (ticket) =>
                        ticket.ticketNumber.toLowerCase().includes(search) ||
                        ticket.customerName.toLowerCase().includes(search) ||
                        ticket.subject.toLowerCase().includes(search) ||
                        ticket.description.toLowerCase().includes(search),
                );
            }
        }

        return filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    // Update ticket status
    async updateTicketStatus(
        ticketId: string,
        status: CustomerServiceTicket['status'],
        agentId?: string,
    ): Promise<boolean> {
        const ticket = this.tickets.find((t) => t.id === ticketId);
        if (!ticket) return false;

        const oldStatus = ticket.status;
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();

        if (status === 'resolved' || status === 'closed') {
            ticket.resolvedAt = new Date().toISOString();
            if (ticket.assignedAgentId) {
                const agent = this.getAgentById(ticket.assignedAgentId);
                if (agent) {
                    agent.currentCaseLoad = Math.max(0, agent.currentCaseLoad - 1);
                }
            }
        }

        // Add system message to conversation
        ticket.conversationHistory.push({
            id: `msg-${Date.now()}`,
            senderId: agentId || 'system',
            senderName: agentId ? this.getAgentById(agentId)?.name || 'Agent' : 'System',
            senderType: 'system',
            message: `Ticket status changed from ${oldStatus} to ${status}`,
            timestamp: new Date().toISOString(),
            isInternal: true,
        });

        return true;
    }

    // Add message to ticket
    async addMessageToTicket(
        ticketId: string,
        senderId: string,
        senderName: string,
        senderType: 'customer' | 'agent' | 'system',
        message: string,
        isInternal: boolean = false,
        attachments?: string[],
    ): Promise<boolean> {
        const ticket = this.tickets.find((t) => t.id === ticketId);
        if (!ticket) return false;

        const newMessage: TicketMessage = {
            id: `msg-${Date.now()}`,
            senderId,
            senderName,
            senderType,
            message,
            timestamp: new Date().toISOString(),
            attachments,
            isInternal,
        };

        ticket.conversationHistory.push(newMessage);
        ticket.updatedAt = new Date().toISOString();

        // If customer message and ticket was resolved, reopen it
        if (senderType === 'customer' && ticket.status === 'resolved') {
            ticket.status = 'open';
        }

        return true;
    }

    // Assign ticket to agent
    async assignTicket(ticketId: string, agentId: string): Promise<boolean> {
        const ticket = this.tickets.find((t) => t.id === ticketId);
        const agent = this.getAgentById(agentId);

        if (!ticket || !agent) return false;
        if (agent.currentCaseLoad >= agent.maxCaseLoad) return false;

        // Remove from previous agent if assigned
        if (ticket.assignedAgentId) {
            const previousAgent = this.getAgentById(ticket.assignedAgentId);
            if (previousAgent) {
                previousAgent.currentCaseLoad = Math.max(0, previousAgent.currentCaseLoad - 1);
            }
        }

        ticket.assignedAgentId = agentId;
        ticket.assignedAgentName = agent.name;
        ticket.status = 'in-progress';
        ticket.updatedAt = new Date().toISOString();
        agent.currentCaseLoad++;

        // Add system message
        await this.addMessageToTicket(
            ticketId,
            'system',
            'System',
            'system',
            `Ticket assigned to ${agent.name}`,
            true,
        );

        return true;
    }

    // Escalate ticket
    async escalateTicket(ticketId: string, escalatedBy: string, reason: string): Promise<boolean> {
        const ticket = this.tickets.find((t) => t.id === ticketId);
        if (!ticket) return false;

        const escalation: TicketEscalation = {
            id: `esc-${Date.now()}`,
            escalatedBy,
            escalatedTo: 'supervisor',
            reason,
            timestamp: new Date().toISOString(),
            level: ticket.escalationHistory.length + 1,
        };

        ticket.escalationHistory.push(escalation);
        ticket.priority = 'urgent';
        ticket.updatedAt = new Date().toISOString();

        // Add system message
        await this.addMessageToTicket(
            ticketId,
            escalatedBy,
            'Agent',
            'system',
            `Ticket escalated: ${reason}`,
            true,
        );

        return true;
    }

    // Get pharmacy coordination tasks
    getPharmacyTasks(filters?: {
        pharmacyId?: string;
        status?: string[];
        taskType?: string[];
        assignedAgentId?: string;
    }): PharmacyCoordinationTask[] {
        let filtered = [...this.pharmacyTasks];

        if (filters) {
            if (filters.pharmacyId) {
                filtered = filtered.filter((task) => task.pharmacyId === filters.pharmacyId);
            }
            if (filters.status && filters.status.length > 0) {
                filtered = filtered.filter((task) => filters.status!.includes(task.status));
            }
            if (filters.taskType && filters.taskType.length > 0) {
                filtered = filtered.filter((task) => filters.taskType!.includes(task.taskType));
            }
            if (filters.assignedAgentId) {
                filtered = filtered.filter(
                    (task) => task.assignedAgentId === filters.assignedAgentId,
                );
            }
        }

        return filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    // Create pharmacy coordination task
    async createPharmacyTask(
        taskData: Partial<PharmacyCoordinationTask>,
    ): Promise<PharmacyCoordinationTask> {
        const newTask: PharmacyCoordinationTask = {
            id: `task-${Date.now()}`,
            pharmacyId: taskData.pharmacyId || '',
            pharmacyName: taskData.pharmacyName || '',
            taskType: taskData.taskType || 'inventory-check',
            priority: taskData.priority || 'normal',
            status: 'pending',
            description: taskData.description || '',
            assignedAgentId: taskData.assignedAgentId || '',
            relatedOrderId: taskData.relatedOrderId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notes: [],
        };

        this.pharmacyTasks.unshift(newTask);
        return newTask;
    }

    // Get analytics
    getAnalytics(): AppServicesAnalytics {
        const totalTickets = this.tickets.length;
        const openTickets = this.tickets.filter((t) => t.status === 'open').length;
        const inProgressTickets = this.tickets.filter((t) => t.status === 'in-progress').length;
        const resolvedTickets = this.tickets.filter(
            (t) => t.status === 'resolved' || t.status === 'closed',
        ).length;

        const resolvedWithTime = this.tickets.filter((t) => t.resolvedAt && t.resolutionTime);
        const averageResolutionTime =
            resolvedWithTime.length > 0
                ? resolvedWithTime.reduce((sum, t) => sum + (t.resolutionTime || 0), 0) /
                  resolvedWithTime.length /
                  60 // convert to hours
                : 0;

        const ratedTickets = this.tickets.filter((t) => t.customerSatisfactionRating);
        const customerSatisfactionScore =
            ratedTickets.length > 0
                ? ratedTickets.reduce((sum, t) => sum + (t.customerSatisfactionRating || 0), 0) /
                  ratedTickets.length
                : 0;

        const escalatedTickets = this.tickets.filter((t) => t.escalationHistory.length > 0).length;
        const escalationRate = totalTickets > 0 ? (escalatedTickets / totalTickets) * 100 : 0;

        const firstContactResolved = this.tickets.filter(
            (t) => t.status === 'resolved' && t.conversationHistory.length <= 2,
        ).length;
        const firstContactResolutionRate =
            resolvedTickets > 0 ? (firstContactResolved / resolvedTickets) * 100 : 0;

        const agentPerformance = this.agents.map((agent) => ({
            agentId: agent.id,
            agentName: agent.name,
            ticketsHandled: agent.performanceMetrics.totalCasesHandled,
            averageResolutionTime: agent.performanceMetrics.averageResolutionTime,
            customerSatisfaction: agent.performanceMetrics.customerSatisfactionRating,
            escalationRate: agent.performanceMetrics.escalationRate,
        }));

        const ticketsByCategory = this.tickets.reduce(
            (acc, ticket) => {
                acc[ticket.type] = (acc[ticket.type] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        const ticketsByPriority = this.tickets.reduce(
            (acc, ticket) => {
                acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            averageResolutionTime,
            customerSatisfactionScore,
            firstContactResolutionRate,
            escalationRate,
            agentPerformance,
            ticketsByCategory,
            ticketsByPriority,
            resolutionTrends: [], // Would be calculated based on historical data
            pharmacyCoordinationMetrics: {
                totalTasks: this.pharmacyTasks.length,
                completedTasks: this.pharmacyTasks.filter((t) => t.status === 'completed').length,
                averageCompletionTime: 2.5, // Mock data
                pharmacyResponseRate: 85.2, // Mock data
            },
        };
    }

    // Get dashboard summary
    getDashboardSummary() {
        const suspendedOrders = suspendedOrderService.getSuspendedOrders();
        const analytics = this.getAnalytics();

        return {
            suspendedOrders: suspendedOrders.filter((o) => o.status === 'suspended').length,
            suspendedPrescriptions: 5, // Mock data - would come from prescription service
            pendingIssues: analytics.openTickets + analytics.inProgressTickets,
            resolvedToday: this.tickets.filter(
                (t) =>
                    t.resolvedAt &&
                    new Date(t.resolvedAt).toDateString() === new Date().toDateString(),
            ).length,
            avgResolutionTime: analytics.averageResolutionTime,
            customerSatisfaction: analytics.customerSatisfactionScore,
            escalatedCases: this.tickets.filter((t) => t.escalationHistory.length > 0).length,
            activeAgents: this.agents.filter((a) => a.status === 'active').length,
        };
    }
}

export const appServicesManagementService = new AppServicesManagementService();
