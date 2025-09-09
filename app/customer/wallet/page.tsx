'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Package, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { walletService } from '@/lib/services/walletService';
import { WalletBalance, WalletTransaction } from '@/lib/types';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { ClientOnly } from '@/components/common/ClientOnly';
import { CustomerMobileSideNavigation } from '@/components/mobile/CustomerMobileSideNavigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Cookies from 'js-cookie';

interface CustomerOrder {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    pharmacyName?: string;
    items?: Array<{
        productName: string;
        quantity: number;
    }>;
}

export default function CustomerWalletPage() {
    const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadWalletData();
            loadCustomerOrders();
        }
    }, [user]);

    const loadWalletData = async () => {
        setIsLoading(true);
        try {
            // Fetch user data from /auth/me endpoint
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const userData = data.data.user;
                    const creditAmount = userData.credit || 0;

                    // Set wallet balance from user credit
                    const walletBalanceData: WalletBalance = {
                        available: creditAmount,
                        pending: 0, // Set to 0 since we don't use pending
                        total: creditAmount,
                        currency: 'EGP'
                    };

                    setWalletBalance(walletBalanceData);
                } else {
                    console.error('Failed to fetch user data:', data.error);
                }
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }

            // Load transaction history using wallet service
            const customerId = user?._id;
            if (customerId) {
                const transactionHistory = await walletService.getTransactionHistory(customerId);
                setTransactions(transactionHistory);
            }
        } catch (error) {
            console.error('Error loading wallet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCustomerOrders = async () => {
        setIsOrdersLoading(true);
        try {
            const token = Cookies.get('authToken');
            const customerId = user?._id;

            if (!customerId) {
                console.error('No authenticated user found for orders');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('All orders data:', data.data); // Debug: see all orders
                    // Filter to show only confirmed, delivered and refunded orders
                    const filteredOrders = data.data.filter((order: any) =>
                        order.status === 'confirmed' || order.status === 'delivered' || order.status === 'refunded'
                    );
                    console.log('Filtered orders:', filteredOrders); // Debug: see filtered orders
                    setOrders(filteredOrders);
                }
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading customer orders:', error);
        } finally {
            setIsOrdersLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTransactionIcon = (type: string, referenceType?: string) => {
        if (type === 'credit') {
            if (referenceType === 'refund') {
                return <RefreshCw className="w-4 h-4 text-green-600" data-oid="jcwwmic" />;
            }
            return <ArrowDownLeft className="w-4 h-4 text-green-600" data-oid="rujvb77" />;
        } else {
            if (referenceType === 'order') {
                return <Wallet className="w-4 h-4 text-blue-600" data-oid="t3qjg.k" />;
            }
            return <ArrowUpRight className="w-4 h-4 text-red-600" data-oid=":6xi9fv" />;
        }
    };

    const getTransactionColor = (type: string, referenceType?: string) => {
        if (type === 'credit') {
            return 'text-green-600';
        } else {
            if (referenceType === 'order') {
                return 'text-blue-600';
            }
            return 'text-red-600';
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout title="My Wallet" userType="customer" data-oid="4.vcq8v">
                <div className="min-h-screen bg-gray-50 py-8" data-oid="g_q__d7">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="2adrru4">
                        <div className="flex items-center justify-center h-64" data-oid="-6hwnqh">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F]"
                                data-oid="oa1oyu8"
                            ></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    };

    return (
        <div>
            {/* Mobile Layout */}
            <div className="block md:hidden min-h-screen bg-gray-50" data-oid="mobile-layout">
                <ResponsiveHeader data-oid="mobile-header" />

                <div className="px-4 py-6" data-oid="mobile-content">
                    <div className="mb-6" data-oid="mobile-title">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="mobile-h1">
                            My Wallet
                        </h1>
                        <div
                            className="h-1 w-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full"
                            data-oid="mobile-divider"
                        ></div>
                    </div>

                    {/* Wallet Balance Card - Mobile */}
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-2xl p-6 mb-6 text-white"
                        data-oid="mobile-balance-card"
                    >
                        <div
                            className="flex items-center justify-between mb-4"
                            data-oid="mobile-balance-header"
                        >
                            <div
                                className="flex items-center space-x-3"
                                data-oid="mobile-wallet-icon"
                            >
                                <div
                                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                                    data-oid="mobile-wallet-icon-container"
                                >
                                    <Wallet className="w-5 h-5" data-oid="mobile-wallet-svg" />
                                </div>
                                <div data-oid="mobile-wallet-text">
                                    <h2
                                        className="text-lg font-semibold"
                                        data-oid="mobile-wallet-title"
                                    >
                                        Wallet Balance
                                    </h2>
                                    <p
                                        className="text-blue-100 text-sm"
                                        data-oid="mobile-wallet-subtitle"
                                    >
                                        Available funds
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={loadWalletData}
                                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                data-oid="mobile-refresh-btn"
                            >
                                <RefreshCw className="w-4 h-4" data-oid="mobile-refresh-icon" />
                            </button>
                        </div>

                        <div className="space-y-4" data-oid="mobile-balance-values">
                            <div data-oid="mobile-available-balance">
                                <p
                                    className="text-blue-100 text-sm mb-1"
                                    data-oid="mobile-available-label"
                                >
                                    Available Balance
                                </p>
                                <p className="text-2xl font-bold" data-oid="mobile-available-value">
                                    {walletBalance?.available.toFixed(2) || '0.00'}{' '}
                                    {walletBalance?.currency || 'EGP'}
                                </p>
                            </div>
                            <div
                                className="grid grid-cols-2 gap-4"
                                data-oid="mobile-other-balances"
                            >
                                <div data-oid="mobile-pending-balance">
                                    <p
                                        className="text-blue-100 text-sm mb-1"
                                        data-oid="mobile-pending-label"
                                    >
                                        Pending
                                    </p>
                                    <p
                                        className="text-lg font-semibold"
                                        data-oid="mobile-pending-value"
                                    >
                                        {walletBalance?.pending.toFixed(2) || '0.00'}{' '}
                                        {walletBalance?.currency || 'EGP'}
                                    </p>
                                </div>
                                <div data-oid="mobile-total-balance">
                                    <p
                                        className="text-blue-100 text-sm mb-1"
                                        data-oid="mobile-total-label"
                                    >
                                        Total
                                    </p>
                                    <p
                                        className="text-lg font-semibold"
                                        data-oid="mobile-total-value"
                                    >
                                        {walletBalance?.total.toFixed(2) || '0.00'}{' '}
                                        {walletBalance?.currency || 'EGP'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History - Mobile */}
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                        data-oid="mobile-transaction-history"
                    >
                        <div
                            className="p-4 border-b border-gray-100"
                            data-oid="mobile-transaction-header"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900"
                                data-oid="mobile-transaction-title"
                            >
                                Transaction History
                            </h3>
                            <p
                                className="text-sm text-gray-600"
                                data-oid="mobile-transaction-subtitle"
                            >
                                Recent wallet transactions
                            </p>
                        </div>

                        <div
                            className="divide-y divide-gray-100"
                            data-oid="mobile-transaction-list"
                        >
                            {transactions.length === 0 ? (
                                <div className="p-8 text-center" data-oid="mobile-no-transactions">
                                    <Wallet
                                        className="w-12 h-12 text-gray-300 mx-auto mb-4"
                                        data-oid="mobile-no-transactions-icon"
                                    />

                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="mobile-no-transactions-title"
                                    >
                                        No transactions yet
                                    </h3>
                                    <p
                                        className="text-gray-600"
                                        data-oid="mobile-no-transactions-text"
                                    >
                                        Your transaction history will appear here
                                    </p>
                                </div>
                            ) : (
                                transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                        data-oid="mobile-transaction-item"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="mobile-transaction-content"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="mobile-transaction-info"
                                            >
                                                <div
                                                    className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
                                                    data-oid="mobile-transaction-icon-container"
                                                >
                                                    {getTransactionIcon(
                                                        transaction.type,
                                                        transaction.referenceType,
                                                    )}
                                                </div>
                                                <div data-oid="mobile-transaction-details">
                                                    <h4
                                                        className="font-medium text-gray-900 text-sm"
                                                        data-oid="mobile-transaction-description"
                                                    >
                                                        {transaction.description}
                                                    </h4>
                                                    <div
                                                        className="flex items-center space-x-2 text-xs text-gray-600"
                                                        data-oid="mobile-transaction-meta"
                                                    >
                                                        <span data-oid="mobile-transaction-date">
                                                            {formatDate(transaction.createdAt)}
                                                        </span>
                                                        {transaction.reference && (
                                                            <>
                                                                <span data-oid="mobile-transaction-ref-separator">
                                                                    •
                                                                </span>
                                                                <span data-oid="mobile-transaction-ref">
                                                                    Ref: {transaction.reference}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="text-right"
                                                data-oid="mobile-transaction-amount"
                                            >
                                                <p
                                                    className={`font-semibold text-sm ${getTransactionColor(transaction.type, transaction.referenceType)}`}
                                                    data-oid="mobile-transaction-amount-value"
                                                >
                                                    {transaction.type === 'credit' ? '+' : '-'}
                                                    {transaction.amount.toFixed(2)} EGP
                                                </p>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                                        transaction.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : transaction.status === 'pending'
                                                              ? 'bg-yellow-100 text-yellow-800'
                                                              : 'bg-red-100 text-red-800'
                                                    }`}
                                                    data-oid="mobile-transaction-status"
                                                >
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Orders History - Mobile */}
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6"
                        data-oid="mobile-orders-history"
                    >
                        <div
                            className="p-4 border-b border-gray-100"
                            data-oid="mobile-orders-header"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900"
                                data-oid="mobile-orders-title"
                            >
                                Order History
                            </h3>
                            <p
                                className="text-sm text-gray-600"
                                data-oid="mobile-orders-subtitle"
                            >
                                Your confirmed and refunded orders
                            </p>
                        </div>

                        <div
                            className="divide-y divide-gray-100"
                            data-oid="mobile-orders-list"
                        >
                            {isOrdersLoading ? (
                                <div className="p-8 text-center" data-oid="mobile-loading-orders">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F] mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="p-8 text-center" data-oid="mobile-no-orders">
                                    <Package
                                        className="w-12 h-12 text-gray-300 mx-auto mb-4"
                                        data-oid="mobile-no-orders-icon"
                                    />
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="mobile-no-orders-title"
                                    >
                                        No orders found
                                    </h3>
                                    <p
                                        className="text-gray-600"
                                        data-oid="mobile-no-orders-text"
                                    >
                                        Your confirmed and refunded orders will appear here
                                    </p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                        data-oid="mobile-order-item"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="mobile-order-content"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="mobile-order-info"
                                            >
                                                <div
                                                    className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
                                                    data-oid="mobile-order-icon-container"
                                                >
                                                    <Package className="w-4 h-4 text-[#1F1F6F]" />
                                                </div>
                                                <div data-oid="mobile-order-details">
                                                    <h4
                                                        className="font-medium text-gray-900 text-sm"
                                                        data-oid="mobile-order-number"
                                                    >
                                                        {order.orderNumber}
                                                    </h4>
                                                    <div
                                                        className="flex items-center space-x-2 text-xs text-gray-600"
                                                        data-oid="mobile-order-meta"
                                                    >
                                                        <span data-oid="mobile-order-date">
                                                            {formatDate(new Date(order.createdAt))}
                                                        </span>
                                                        {order.pharmacyName && (
                                                            <>
                                                                <span>•</span>
                                                                <span data-oid="mobile-order-pharmacy">
                                                                    {order.pharmacyName}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="text-right"
                                                data-oid="mobile-order-amount"
                                            >
                                                <p
                                                    className="font-semibold text-sm text-[#1F1F6F]"
                                                    data-oid="mobile-order-amount-value"
                                                >
                                                    {order.subtotal} EGP
                                                </p>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                                        order.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'refunded'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                    data-oid="mobile-order-status"
                                                >
                                                    {order.status === 'confirmed' ? 'Confirmed' : order.status === 'refunded' ? 'Refunded' : order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block" data-oid="desktop-layout">
                <DashboardLayout title="My Wallet" userType="customer" data-oid="desktop-wallet">
                    <div className="min-h-screen bg-gray-50 py-8" data-oid="desktop-content">
                        <div
                            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
                            data-oid="desktop-container"
                        >
                            {/* Header */}
                            <div className="mb-8" data-oid="desktop-header">
                                <h1
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="desktop-title"
                                >
                                    My Wallet
                                </h1>
                                <p className="text-gray-600" data-oid="desktop-subtitle">
                                    Manage your wallet balance and view transaction history
                                </p>
                            </div>

                            {/* Wallet Balance Card */}
                            <div
                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-2xl p-8 mb-8 text-white"
                                data-oid="desktop-balance-card"
                            >
                                <div
                                    className="flex items-center justify-between mb-6"
                                    data-oid="desktop-balance-header"
                                >
                                    <div
                                        className="flex items-center space-x-3"
                                        data-oid="desktop-wallet-icon"
                                    >
                                        <div
                                            className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                                            data-oid="desktop-wallet-icon-container"
                                        >
                                            <Wallet
                                                className="w-6 h-6"
                                                data-oid="desktop-wallet-svg"
                                            />
                                        </div>
                                        <div data-oid="desktop-wallet-text">
                                            <h2
                                                className="text-xl font-semibold"
                                                data-oid="desktop-wallet-title"
                                            >
                                                Wallet Balance
                                            </h2>
                                            <p
                                                className="text-blue-100"
                                                data-oid="desktop-wallet-subtitle"
                                            >
                                                Available funds
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={loadWalletData}
                                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                        data-oid="desktop-refresh-btn"
                                    >
                                        <RefreshCw
                                            className="w-5 h-5"
                                            data-oid="desktop-refresh-icon"
                                        />
                                    </button>
                                </div>

                                <div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                    data-oid="desktop-balance-values"
                                >
                                    <div data-oid="desktop-available-balance">
                                        <p
                                            className="text-blue-100 text-sm mb-1"
                                            data-oid="desktop-available-label"
                                        >
                                            Available Balance
                                        </p>
                                        <p
                                            className="text-3xl font-bold"
                                            data-oid="desktop-available-value"
                                        >
                                            {walletBalance?.available.toFixed(2) || '0.00'}{' '}
                                            {walletBalance?.currency || 'EGP'}
                                        </p>
                                    </div>
                                    <div data-oid="desktop-pending-balance">
                                        <p
                                            className="text-blue-100 text-sm mb-1"
                                            data-oid="desktop-pending-label"
                                        >
                                            Pending
                                        </p>
                                        <p
                                            className="text-xl font-semibold"
                                            data-oid="desktop-pending-value"
                                        >
                                            {walletBalance?.pending.toFixed(2) || '0.00'}{' '}
                                            {walletBalance?.currency || 'EGP'}
                                        </p>
                                    </div>
                                    <div data-oid="desktop-total-balance">
                                        <p
                                            className="text-blue-100 text-sm mb-1"
                                            data-oid="desktop-total-label"
                                        >
                                            Total
                                        </p>
                                        <p
                                            className="text-xl font-semibold"
                                            data-oid="desktop-total-value"
                                        >
                                            {walletBalance?.total.toFixed(2) || '0.00'}{' '}
                                            {walletBalance?.currency || 'EGP'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100"
                                data-oid="desktop-transaction-history"
                            >
                                <div
                                    className="p-6 border-b border-gray-100"
                                    data-oid="desktop-transaction-header"
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="desktop-transaction-title"
                                    >
                                        Transaction History
                                    </h3>
                                    <p
                                        className="text-sm text-gray-600"
                                        data-oid="desktop-transaction-subtitle"
                                    >
                                        Recent wallet transactions
                                    </p>
                                </div>

                                <div
                                    className="divide-y divide-gray-100"
                                    data-oid="desktop-transaction-list"
                                >
                                    {transactions.length === 0 ? (
                                        <div
                                            className="p-12 text-center"
                                            data-oid="desktop-no-transactions"
                                        >
                                            <Wallet
                                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                                data-oid="desktop-no-transactions-icon"
                                            />

                                            <h3
                                                className="text-lg font-semibold text-gray-900 mb-2"
                                                data-oid="desktop-no-transactions-title"
                                            >
                                                No transactions yet
                                            </h3>
                                            <p
                                                className="text-gray-600"
                                                data-oid="desktop-no-transactions-text"
                                            >
                                                Your transaction history will appear here
                                            </p>
                                        </div>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="p-6 hover:bg-gray-50 transition-colors"
                                                data-oid="desktop-transaction-item"
                                            >
                                                <div
                                                    className="flex items-center justify-between"
                                                    data-oid="desktop-transaction-content"
                                                >
                                                    <div
                                                        className="flex items-center space-x-4"
                                                        data-oid="desktop-transaction-info"
                                                    >
                                                        <div
                                                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                                                            data-oid="desktop-transaction-icon-container"
                                                        >
                                                            {getTransactionIcon(
                                                                transaction.type,
                                                                transaction.referenceType,
                                                            )}
                                                        </div>
                                                        <div data-oid="desktop-transaction-details">
                                                            <h4
                                                                className="font-medium text-gray-900"
                                                                data-oid="desktop-transaction-description"
                                                            >
                                                                {transaction.description}
                                                            </h4>
                                                            <div
                                                                className="flex items-center space-x-2 text-sm text-gray-600"
                                                                data-oid="desktop-transaction-meta"
                                                            >
                                                                <span data-oid="desktop-transaction-date">
                                                                    {formatDate(
                                                                        transaction.createdAt,
                                                                    )}
                                                                </span>
                                                                {transaction.reference && (
                                                                    <>
                                                                        <span data-oid="desktop-transaction-ref-separator">
                                                                            •
                                                                        </span>
                                                                        <span data-oid="desktop-transaction-ref">
                                                                            Ref:{' '}
                                                                            {transaction.reference}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-right"
                                                        data-oid="desktop-transaction-amount"
                                                    >
                                                        <p
                                                            className={`font-semibold ${getTransactionColor(transaction.type, transaction.referenceType)}`}
                                                            data-oid="desktop-transaction-amount-value"
                                                        >
                                                            {transaction.type === 'credit'
                                                                ? '+'
                                                                : '-'}
                                                            {transaction.amount.toFixed(2)} EGP
                                                        </p>
                                                        <span
                                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                                                transaction.status === 'completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : transaction.status ===
                                                                        'pending'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : 'bg-red-100 text-red-800'
                                                            }`}
                                                            data-oid="desktop-transaction-status"
                                                        >
                                                            {transaction.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Orders History - Desktop */}
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8"
                                data-oid="desktop-orders-history"
                            >
                                <div
                                    className="p-6 border-b border-gray-100"
                                    data-oid="desktop-orders-header"
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="desktop-orders-title"
                                    >
                                        Order History
                                    </h3>
                                    <p
                                        className="text-sm text-gray-600"
                                        data-oid="desktop-orders-subtitle"
                                    >
                                        Your confirmed and refunded orders
                                    </p>
                                </div>

                                <div
                                    className="divide-y divide-gray-100"
                                    data-oid="desktop-orders-list"
                                >
                                    {isOrdersLoading ? (
                                        <div
                                            className="p-12 text-center"
                                            data-oid="desktop-loading-orders"
                                        >
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1F1F6F] mx-auto mb-4"></div>
                                            <p className="text-gray-600">Loading orders...</p>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div
                                            className="p-12 text-center"
                                            data-oid="desktop-no-orders"
                                        >
                                            <Package
                                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                                data-oid="desktop-no-orders-icon"
                                            />
                                            <h3
                                                className="text-lg font-semibold text-gray-900 mb-2"
                                                data-oid="desktop-no-orders-title"
                                            >
                                                No orders found
                                            </h3>
                                            <p
                                                className="text-gray-600"
                                                data-oid="desktop-no-orders-text"
                                            >
                                                Your confirmed and refunded orders will appear here
                                            </p>
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div
                                                key={order._id}
                                                className="p-6 hover:bg-gray-50 transition-colors"
                                                data-oid="desktop-order-item"
                                            >
                                                <div
                                                    className="flex items-center justify-between"
                                                    data-oid="desktop-order-content"
                                                >
                                                    <div
                                                        className="flex items-center space-x-4"
                                                        data-oid="desktop-order-info"
                                                    >
                                                        <div
                                                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                                                            data-oid="desktop-order-icon-container"
                                                        >
                                                            <Package className="w-5 h-5 text-[#1F1F6F]" />
                                                        </div>
                                                        <div data-oid="desktop-order-details">
                                                            <h4
                                                                className="font-medium text-gray-900"
                                                                data-oid="desktop-order-number"
                                                            >
                                                                {order.orderNumber}
                                                            </h4>
                                                            <div
                                                                className="flex items-center space-x-2 text-sm text-gray-600"
                                                                data-oid="desktop-order-meta"
                                                            >
                                                                <span data-oid="desktop-order-date">
                                                                    {formatDate(new Date(order.createdAt))}
                                                                </span>
                                                                {order.pharmacyName && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span data-oid="desktop-order-pharmacy">
                                                                            {order.pharmacyName}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-right"
                                                        data-oid="desktop-order-amount"
                                                    >
                                                        <p
                                                            className="font-semibold text-[#1F1F6F]"
                                                            data-oid="desktop-order-amount-value"
                                                        >
                                                            {order.totalAmount.toFixed(2)} EGP
                                                        </p>
                                                        <span
                                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                                                order.status === 'confirmed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : order.status === 'refunded'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                            data-oid="desktop-order-status"
                                                        >
                                                            {order.status === 'confirmed' ? 'Confirmed' : order.status === 'refunded' ? 'Refunded' : order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            </div>
        </div>
    );
}
