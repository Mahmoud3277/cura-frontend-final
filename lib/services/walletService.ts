import { Wallet, WalletTransaction, WalletBalance } from '@/lib/types';

export interface CreateWalletRequest {
    customerId: string;
    initialBalance?: number;
}

export interface AddFundsRequest {
    walletId: string;
    amount: number;
    description: string;
    reference?: string;
    referenceType?: 'order' | 'return' | 'refund' | 'topup' | 'withdrawal';
}

export interface DeductFundsRequest {
    walletId: string;
    amount: number;
    description: string;
    reference?: string;
    referenceType?: 'order' | 'return' | 'refund' | 'topup' | 'withdrawal';
}

class WalletService {
    private mockWallets: Wallet[] = [
        {
            id: 'wallet-1',
            customerId: '1',
            balance: 58.0, // 125.50 + 67.25 - 89.75 - 45.00 = 58.00 (completed transactions only)
            currency: 'EGP',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    private mockTransactions: WalletTransaction[] = [
        // Sample refund from returned order
        {
            id: 'txn-refund-001',
            walletId: 'wallet-1',
            customerId: '1',
            type: 'credit',
            amount: 125.5,
            description: 'Refund for returned order #ORD-2024-001',
            reference: 'ORD-2024-001',
            referenceType: 'refund',
            status: 'completed',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        // Sample order payment using wallet
        {
            id: 'txn-order-001',
            walletId: 'wallet-1',
            customerId: '1',
            type: 'debit',
            amount: 89.75,
            description: 'Payment for order #ORD-2024-003',
            reference: 'ORD-2024-003',
            referenceType: 'order',
            status: 'completed',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        // Another refund from returned order
        {
            id: 'txn-refund-002',
            walletId: 'wallet-1',
            customerId: '1',
            type: 'credit',
            amount: 67.25,
            description: 'Refund for returned order #ORD-2024-002',
            reference: 'ORD-2024-002',
            referenceType: 'refund',
            status: 'completed',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        // Recent order payment using wallet
        {
            id: 'txn-order-002',
            walletId: 'wallet-1',
            customerId: '1',
            type: 'debit',
            amount: 45.0,
            description: 'Payment for order #ORD-2024-004',
            reference: 'ORD-2024-004',
            referenceType: 'order',
            status: 'completed',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            processedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
        // Pending refund
        {
            id: 'txn-refund-003',
            walletId: 'wallet-1',
            customerId: '1',
            type: 'credit',
            amount: 156.8,
            description: 'Refund for returned order #ORD-2024-005',
            reference: 'ORD-2024-005',
            referenceType: 'refund',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
    ];

    async createWallet(
        request: CreateWalletRequest,
    ): Promise<{ success: boolean; wallet?: Wallet; error?: string }> {
        try {
            // Check if wallet already exists for customer
            const existingWallet = this.mockWallets.find(
                (w) => w.customerId === request.customerId,
            );
            if (existingWallet) {
                return { success: false, error: 'Wallet already exists for this customer' };
            }

            const newWallet: Wallet = {
                id: `wallet-${Date.now()}`,
                customerId: request.customerId,
                balance: request.initialBalance || 0,
                currency: 'EGP',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            this.mockWallets.push(newWallet);

            // Create initial transaction if there's an initial balance
            if (request.initialBalance && request.initialBalance > 0) {
                await this.addTransaction({
                    walletId: newWallet.id,
                    customerId: newWallet.customerId,
                    type: 'credit',
                    amount: request.initialBalance,
                    description: 'Initial wallet balance',
                    referenceType: 'topup',
                    status: 'completed',
                });
            }

            return { success: true, wallet: newWallet };
        } catch (error) {
            console.error('Error creating wallet:', error);
            return { success: false, error: 'Failed to create wallet' };
        }
    }

    async getWalletByCustomerId(customerId: string): Promise<Wallet | null> {
        return this.mockWallets.find((w) => w.customerId === customerId && w.isActive) || null;
    }

    async getWalletBalance(customerId: string): Promise<WalletBalance | null> {
        const wallet = await this.getWalletByCustomerId(customerId);
        if (!wallet) return null;

        const pendingTransactions = this.mockTransactions.filter(
            (t) => t.customerId === customerId && t.status === 'pending',
        );

        const pendingAmount = pendingTransactions.reduce((sum, t) => {
            return sum + (t.type === 'credit' ? t.amount : -t.amount);
        }, 0);

        return {
            available: wallet.balance,
            pending: pendingAmount,
            total: wallet.balance + pendingAmount,
            currency: wallet.currency,
        };
    }

    async addFunds(
        request: AddFundsRequest,
    ): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> {
        try {
            const wallet = this.mockWallets.find((w) => w.id === request.walletId);
            if (!wallet) {
                return { success: false, error: 'Wallet not found' };
            }

            // Update wallet balance
            wallet.balance += request.amount;
            wallet.updatedAt = new Date();

            // Create transaction record
            const transaction = await this.addTransaction({
                walletId: request.walletId,
                customerId: wallet.customerId,
                type: 'credit',
                amount: request.amount,
                description: request.description,
                reference: request.reference,
                referenceType: request.referenceType,
                status: 'completed',
            });

            return { success: true, transaction };
        } catch (error) {
            console.error('Error adding funds:', error);
            return { success: false, error: 'Failed to add funds' };
        }
    }

    async deductFunds(
        request: DeductFundsRequest,
    ): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> {
        try {
            const wallet = this.mockWallets.find((w) => w.id === request.walletId);
            if (!wallet) {
                return { success: false, error: 'Wallet not found' };
            }

            if (wallet.balance < request.amount) {
                return { success: false, error: 'Insufficient balance' };
            }

            // Update wallet balance
            wallet.balance -= request.amount;
            wallet.updatedAt = new Date();

            // Create transaction record
            const transaction = await this.addTransaction({
                walletId: request.walletId,
                customerId: wallet.customerId,
                type: 'debit',
                amount: request.amount,
                description: request.description,
                reference: request.reference,
                referenceType: request.referenceType,
                status: 'completed',
            });

            return { success: true, transaction };
        } catch (error) {
            console.error('Error deducting funds:', error);
            return { success: false, error: 'Failed to deduct funds' };
        }
    }

    async processRefund(
        customerId: string,
        amount: number,
        orderId: string,
        description: string,
    ): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> {
        try {
            let wallet = await this.getWalletByCustomerId(customerId);

            // Create wallet if it doesn't exist
            if (!wallet) {
                const createResult = await this.createWallet({ customerId });
                if (!createResult.success || !createResult.wallet) {
                    return { success: false, error: 'Failed to create wallet for refund' };
                }
                wallet = createResult.wallet;
            }

            // Check if there's already a pending transaction for this order
            const existingPendingTransaction = this.mockTransactions.find(
                (t) =>
                    t.reference === orderId &&
                    t.status === 'pending' &&
                    t.referenceType === 'refund',
            );

            if (existingPendingTransaction) {
                // Convert pending transaction to completed
                existingPendingTransaction.status = 'completed';
                existingPendingTransaction.processedAt = new Date();

                // Add the amount to wallet balance
                wallet.balance += amount;
                wallet.updatedAt = new Date();

                console.log(
                    `✅ Pending refund approved: ${amount} EGP moved from pending to available balance`,
                );
                return { success: true, transaction: existingPendingTransaction };
            } else {
                // Add refund directly to wallet (immediate approval)
                const result = await this.addFunds({
                    walletId: wallet.id,
                    amount,
                    description,
                    reference: orderId,
                    referenceType: 'refund',
                });

                return result;
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            return { success: false, error: 'Failed to process refund' };
        }
    }

    async getTransactionHistory(
        customerId: string,
        limit: number = 50,
    ): Promise<WalletTransaction[]> {
        return this.mockTransactions
            .filter((t) => t.customerId === customerId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);
    }

    private async addTransaction(data: {
        walletId: string;
        customerId: string;
        type: 'credit' | 'debit';
        amount: number;
        description: string;
        reference?: string;
        referenceType?: 'order' | 'return' | 'refund' | 'topup' | 'withdrawal';
        status: 'pending' | 'completed' | 'failed' | 'cancelled';
    }): Promise<WalletTransaction> {
        const transaction: WalletTransaction = {
            id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...data,
            createdAt: new Date(),
            processedAt: data.status === 'completed' ? new Date() : undefined,
        };

        this.mockTransactions.push(transaction);
        return transaction;
    }

    async createPendingRefund(
        customerId: string,
        amount: number,
        orderId: string,
        description: string,
    ): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> {
        try {
            let wallet = await this.getWalletByCustomerId(customerId);

            // Create wallet if it doesn't exist
            if (!wallet) {
                const createResult = await this.createWallet({ customerId });
                if (!createResult.success || !createResult.wallet) {
                    return { success: false, error: 'Failed to create wallet for pending refund' };
                }
                wallet = createResult.wallet;
            }

            // Create pending transaction (doesn't affect available balance yet)
            const transaction = await this.addTransaction({
                walletId: wallet.id,
                customerId: wallet.customerId,
                type: 'credit',
                amount,
                description,
                reference: orderId,
                referenceType: 'refund',
                status: 'pending',
            });

            console.log(
                `⏳ Pending refund created: ${amount} EGP pending approval for order ${orderId}`,
            );
            return { success: true, transaction };
        } catch (error) {
            console.error('Error creating pending refund:', error);
            return { success: false, error: 'Failed to create pending refund' };
        }
    }

    // Admin functions
    async getAllWallets(): Promise<Wallet[]> {
        return this.mockWallets;
    }

    async getWalletStatistics() {
        const totalWallets = this.mockWallets.length;
        const activeWallets = this.mockWallets.filter((w) => w.isActive).length;
        const totalBalance = this.mockWallets.reduce((sum, w) => sum + w.balance, 0);
        const totalTransactions = this.mockTransactions.length;
        const totalRefunds = this.mockTransactions.filter(
            (t) => t.referenceType === 'refund',
        ).length;
        const totalRefundAmount = this.mockTransactions
            .filter((t) => t.referenceType === 'refund' && t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalWallets,
            activeWallets,
            totalBalance,
            totalTransactions,
            totalRefunds,
            totalRefundAmount,
            averageWalletBalance: totalWallets > 0 ? totalBalance / totalWallets : 0,
        };
    }
}

export const walletService = new WalletService();
