// Message Service - Comprehensive message management for admin dashboard

export interface Message {
    id: string;
    type: 'contact_form' | 'pharmacy_registration' | 'general_inquiry' | 'support_request';
    category: string;
    senderInfo: {
        name: string;
        email: string;
        phone?: string;
        company?: string; // For pharmacy registrations
        position?: string; // For pharmacy registrations
    };
    subject: string;
    content: string;
    metadata?: {
        userAgent?: string;
        ipAddress?: string;
        referrer?: string;
        formSource?: string;
    };
    timestamp: string;
    isRead: boolean;
    tags: string[];
}

export interface ContactFormMessage extends Message {
    type: 'contact_form';
    category: 'general_inquiry' | 'prescription_help' | 'order_support' | 'technical_issue' | 'partnership';
}

export interface PharmacyRegistrationMessage extends Message {
    type: 'pharmacy_registration';
    category: 'new_application' | 'document_submission' | 'follow_up' | 'inquiry';
    senderInfo: {
        name: string; // Owner/Manager Name
        email: string;
        phone: string;
        company: string; // Pharmacy Name
        position: string;
    };
    registrationData: {
        // Basic Information
        pharmacyName: string;
        ownerManagerName: string;
        email: string;
        phoneNumber: string;
        licenseNumber: string;
        
        // Location Information
        fullAddress: string;
        city: string;
        governorate: string;
        operatingHours: string;
        
        // Business Information
        website?: string;
        socialMedia?: string;
        
        // Additional Information
        pharmacyDescription: string; // Tell us about your pharmacy
    };
}

export interface MessageFilters {
    type?: string;
    category?: string;
    isRead?: boolean;
    dateRange?: {
        from: string;
        to: string;
    };
    search?: string;
    tags?: string[];
}

export interface MessageStats {
    total: number;
    unread: number;
    byType: {
        contact_form: number;
        pharmacy_registration: number;
        general_inquiry: number;
        support_request: number;
    };
    byCategory: Record<string, number>;
    recentMessages: number; // Last 24 hours
}

class MessageService {
    private messages: Message[] = [
        {
            id: 'msg-001',
            type: 'contact_form',
            category: 'general_inquiry',
            senderInfo: {
                name: 'Ahmed Hassan',
                email: 'ahmed.hassan@gmail.com',
                phone: '+20 100 123 4567'
            },
            subject: 'Question about prescription delivery',
            content: 'Hello, I would like to know about your prescription delivery service. Do you deliver to all areas in Cairo? What are the delivery times and fees?',
            timestamp: '2024-01-20T14:30:00Z',
            isRead: false,
            tags: ['delivery', 'prescription'],
            metadata: {
                formSource: '/contact',
                userAgent: 'Mozilla/5.0...',
                ipAddress: '192.168.1.100'
            }
        },
        {
            id: 'msg-002',
            type: 'pharmacy_registration',
            category: 'new_application',
            senderInfo: {
                name: 'Dr. Fatima Al-Rashid',
                email: 'fatima.alrashid@newpharmacy.com',
                phone: '+20 101 987 6543',
                company: 'Al-Rashid Pharmacy',
                position: 'Owner/Pharmacist'
            },
            subject: 'New Pharmacy Registration Application',
            content: 'We would like to register our pharmacy with CURA platform. We are located in Alexandria and have been serving the community for 5 years. Please let us know the requirements and process.',
            registrationData: {
                // Basic Information
                pharmacyName: 'Al-Rashid Pharmacy',
                ownerManagerName: 'Dr. Fatima Al-Rashid',
                email: 'fatima.alrashid@newpharmacy.com',
                phoneNumber: '+20 101 987 6543',
                licenseNumber: 'PH-ALX-2024-001',
                
                // Location Information
                fullAddress: '45 Corniche Road, Sidi Gaber, Alexandria 21599',
                city: 'Alexandria',
                governorate: 'Alexandria',
                operatingHours: 'Mon-Fri: 8AM-10PM, Sat-Sun: 9AM-9PM',
                
                // Business Information
                website: 'https://alrashidpharmacy.com',
                socialMedia: 'Facebook: @AlRashidPharmacy, Instagram: @alrashid_pharmacy',
                
                // Additional Information
                pharmacyDescription: 'Al-Rashid Pharmacy has been serving the Alexandria community for over 5 years. We specialize in prescription medications, over-the-counter drugs, and health consultations. Our pharmacy is equipped with modern facilities and staffed by qualified pharmacists. We pride ourselves on providing excellent customer service and maintaining high standards of pharmaceutical care. We are located in the heart of Sidi Gaber area and serve a diverse customer base.'
            },
            timestamp: '2024-01-19T10:15:00Z',
            isRead: false,
            tags: ['registration', 'alexandria', 'new_partner'],
            metadata: {
                formSource: '/register-pharmacy',
                userAgent: 'Mozilla/5.0...',
                ipAddress: '192.168.1.101'
            }
        },
        {
            id: 'msg-003',
            type: 'contact_form',
            category: 'technical_issue',
            senderInfo: {
                name: 'Sara Mohamed',
                email: 'sara.mohamed@hotmail.com',
                phone: '+20 102 456 7890'
            },
            subject: 'Unable to upload prescription',
            content: 'I am having trouble uploading my prescription image. The app keeps showing an error message "File too large". I have tried multiple times with different photos but same issue.',
            timestamp: '2024-01-18T16:45:00Z',
            isRead: true,
            tags: ['technical', 'prescription_upload', 'bug'],
            metadata: {
                formSource: '/contact',
                userAgent: 'Mozilla/5.0...',
                ipAddress: '192.168.1.102'
            }
        },
        {
            id: 'msg-004',
            type: 'contact_form',
            category: 'partnership',
            senderInfo: {
                name: 'Omar Khaled',
                email: 'omar.khaled@mediplus.com',
                phone: '+20 103 789 0123',
                company: 'MediPlus Distributors'
            },
            subject: 'Vendor Partnership Inquiry',
            content: 'We are a medical supplies distributor interested in partnering with CURA. We supply medical devices, supplements, and OTC medications. Could we schedule a meeting to discuss partnership opportunities?',
            timestamp: '2024-01-17T11:20:00Z',
            isRead: true,
            tags: ['partnership', 'vendor', 'business'],
            metadata: {
                formSource: '/contact',
                userAgent: 'Mozilla/5.0...',
                ipAddress: '192.168.1.103'
            }
        },
        {
            id: 'msg-005',
            type: 'contact_form',
            category: 'order_support',
            senderInfo: {
                name: 'Layla Ibrahim',
                email: 'layla.ibrahim@gmail.com',
                phone: '+20 104 567 8901'
            },
            subject: 'Order delivery delay',
            content: 'My order #ORD-2024-001234 was supposed to be delivered yesterday but I have not received it yet. Can you please check the status and provide an update?',
            timestamp: '2024-01-16T09:30:00Z',
            isRead: false,
            tags: ['order', 'delivery', 'delay'],
            metadata: {
                formSource: '/contact',
                userAgent: 'Mozilla/5.0...',
                ipAddress: '192.168.1.104'
            }
        },
        {
            id: 'msg-006',
            type: 'pharmacy_registration',
            category: 'inquiry',
            senderInfo: {
                name: 'Dr. Hassan Mahmoud',
                email: 'hassan.mahmoud@careplus.com',
                phone: '+20 105 234 5678',
                company: 'CarePlus Pharmacy Chain',
                position: 'Regional Manager'
            },
            subject: 'Multi-location pharmacy registration',
            content: 'We operate 5 pharmacy locations across Giza. Can we register all locations under one account or do we need separate registrations for each branch? Also, what are the commission rates for chain pharmacies?',
            registrationData: {
                // Basic Information
                pharmacyName: 'CarePlus Pharmacy Chain',
                ownerManagerName: 'Dr. Hassan Mahmoud',
                email: 'hassan.mahmoud@careplus.com',
                phoneNumber: '+20 105 234 5678',
                licenseNumber: 'PH-GIZ-2024-CHAIN-001',
                
                // Location Information
                fullAddress: 'Main Branch: 123 Pyramids Street, Dokki, Giza + 4 other locations',
                city: 'Giza',
                governorate: 'Giza',
                operatingHours: 'All branches: 24/7 service available',
                
                // Business Information
                website: 'https://careplus-chain.com',
                socialMedia: 'Facebook: @CarePlusChain, Instagram: @careplus_pharmacies, LinkedIn: CarePlus Pharmacy Chain',
                
                // Additional Information
                pharmacyDescription: 'CarePlus Pharmacy Chain operates 5 strategically located pharmacies across Giza Governorate. We have been serving the community for over 10 years with a commitment to providing accessible healthcare. Our chain includes locations in Dokki, Mohandessin, Sheikh Zayed, 6th of October, and Haram areas. Each branch is fully licensed and staffed with certified pharmacists. We offer comprehensive pharmaceutical services including prescription dispensing, health consultations, medical equipment, and emergency medications. Our goal is to provide convenient and reliable pharmaceutical care to families throughout Giza.'
            },
            timestamp: '2024-01-15T13:45:00Z',
            isRead: true,
            tags: ['chain_pharmacy', 'giza', 'multi_location'],
            metadata: {
                formSource: '/register-pharmacy',
                userAgent: 'Mozilla/5.0...',
                ipAddress: '192.168.1.105'
            }
        }
    ];

    // Get all messages with optional filtering
    getMessages(filters?: MessageFilters): Message[] {
        let filteredMessages = [...this.messages];

        if (filters) {
            if (filters.type) {
                filteredMessages = filteredMessages.filter(m => m.type === filters.type);
            }
            if (filters.category) {
                filteredMessages = filteredMessages.filter(m => m.category === filters.category);
            }
            if (filters.isRead !== undefined) {
                filteredMessages = filteredMessages.filter(m => m.isRead === filters.isRead);
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredMessages = filteredMessages.filter(m => 
                    m.senderInfo.name.toLowerCase().includes(searchTerm) ||
                    m.senderInfo.email.toLowerCase().includes(searchTerm) ||
                    m.subject.toLowerCase().includes(searchTerm) ||
                    m.content.toLowerCase().includes(searchTerm) ||
                    (m.senderInfo.company && m.senderInfo.company.toLowerCase().includes(searchTerm))
                );
            }
            if (filters.dateRange) {
                const fromDate = new Date(filters.dateRange.from);
                const toDate = new Date(filters.dateRange.to);
                filteredMessages = filteredMessages.filter(m => {
                    const messageDate = new Date(m.timestamp);
                    return messageDate >= fromDate && messageDate <= toDate;
                });
            }
            if (filters.tags && filters.tags.length > 0) {
                filteredMessages = filteredMessages.filter(m => 
                    filters.tags!.some(tag => m.tags.includes(tag))
                );
            }
        }

        return filteredMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    // Get message by ID
    getMessageById(id: string): Message | undefined {
        return this.messages.find(m => m.id === id);
    }

    // Get message statistics
    getMessageStats(): MessageStats {
        const total = this.messages.length;
        const unread = this.messages.filter(m => !m.isRead).length;
        
        const byType = {
            contact_form: this.messages.filter(m => m.type === 'contact_form').length,
            pharmacy_registration: this.messages.filter(m => m.type === 'pharmacy_registration').length,
            general_inquiry: this.messages.filter(m => m.type === 'general_inquiry').length,
            support_request: this.messages.filter(m => m.type === 'support_request').length,
        };


        const byCategory: Record<string, number> = {};
        this.messages.forEach(m => {
            byCategory[m.category] = (byCategory[m.category] || 0) + 1;
        });

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const recentMessages = this.messages.filter(m => new Date(m.timestamp) >= yesterday).length;

        return {
            total,
            unread,
            byType,
            byCategory,
            recentMessages
        };
    }

    // Mark message as read (for display purposes only)
    markAsRead(messageId: string): boolean {
        const messageIndex = this.messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
            this.messages[messageIndex].isRead = true;
            return true;
        }
        return false;
    }

    // Get categories for filtering
    getCategories(): string[] {
        return Array.from(new Set(this.messages.map(m => m.category)));
    }

    // Get all available tags
    getTags(): string[] {
        const allTags = this.messages.flatMap(m => m.tags);
        return Array.from(new Set(allTags)).sort();
    }

    // Format message type for display
    getMessageTypeLabel(type: string): string {
        const labels: Record<string, string> = {
            'contact_form': 'Contact Form',
            'pharmacy_registration': 'Pharmacy Registration',
            'general_inquiry': 'General Inquiry',
            'support_request': 'Support Request'
        };
        return labels[type] || type;
    }

    // Format category for display
    getCategoryLabel(category: string): string {
        const labels: Record<string, string> = {
            'general_inquiry': 'General Inquiry',
            'prescription_help': 'Prescription Help',
            'order_support': 'Order Support',
            'technical_issue': 'Technical Issue',
            'partnership': 'Partnership',
            'new_application': 'New Application',
            'document_submission': 'Document Submission',
            'follow_up': 'Follow Up',
            'inquiry': 'Inquiry'
        };
        return labels[category] || category;
    }

}

export const messageService = new MessageService();