'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
    vendorInventoryService,
    VendorInventoryItem,
    InventoryMovement,
    InventoryAlert,
    InventoryStats,
    InventoryFilters,
} from '@/lib/services/vendorInventoryService';

export default function VendorInventoryPage() {
    const { user } = useAuth();
    const [inventoryItems, setInventoryItems] = useState<VendorInventoryItem[]>([]);
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'movements' | 'alerts'>(
        'overview',
    );
    const [filters, setFilters] = useState<InventoryFilters>({});
    const [selectedItem, setSelectedItem] = useState<VendorInventoryItem | null>(null);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        loadInventoryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const loadInventoryData = async () => {
        try {
            setIsLoading(true);
            // In real app, get vendor ID from user context
            const vendorId = 'vendor-pharmatech'; // Mock vendor ID

            const items = vendorInventoryService.getInventoryItems(vendorId, filters);
            const movementData = vendorInventoryService.getInventoryMovements(vendorId);
            const alertData = vendorInventoryService.getInventoryAlerts(vendorId);
            const statsData = vendorInventoryService.getInventoryStats(vendorId);
            const discountStats = vendorInventoryService.getDiscountStats(vendorId);

            // Debug logging
            console.log('Loaded inventory items:', items.length);
            console.log(
                'Items with discounts:',
                items.filter((item) => vendorInventoryService.hasActiveDiscount(item)).length,
            );
            console.log('Discount stats:', discountStats);

            setInventoryItems(items);
            setMovements(movementData);
            setAlerts(alertData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading inventory data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `EGP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_stock':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'low_stock':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'out_of_stock':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'discontinued':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleRestock = (item: VendorInventoryItem) => {
        setSelectedItem(item);
        setShowRestockModal(true);
    };

    const handleUpdateStock = (item: VendorInventoryItem) => {
        setSelectedItem(item);
        setShowUpdateModal(true);
    };

    if (isLoading) {
        return (
            <DashboardLayout title="Inventory Management" userType="vendor" data-oid="91m4-mq">
                <div className="flex items-center justify-center p-8" data-oid="r2w89_9">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                        data-oid="naxei_0"
                    ></div>
                    <span className="ml-3 text-gray-600" data-oid=".vu1k:g">
                        Loading inventory...
                    </span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Inventory Management" userType="vendor" data-oid="l:qfgma">
            <div className="space-y-6" data-oid="u43pmek">
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl p-6"
                    data-oid="_9-665p"
                >
                    <div className="flex items-center justify-between" data-oid="w0ll_k8">
                        <div data-oid="vjg9zrn">
                            <h1 className="text-2xl font-bold mb-2" data-oid="51:a-94">
                                Inventory Management
                            </h1>
                            <p className="text-lg opacity-90" data-oid="x__26kp">
                                Track and manage your product inventory
                            </p>
                        </div>
                        <div className="text-right" data-oid="ldy5mif">
                            <div className="text-3xl mb-2" data-oid="mlvvu7c">
                                📦
                            </div>
                            <p className="text-sm opacity-80" data-oid="fml4.v7">
                                {stats?.totalProducts} Products
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6" data-oid="03aq2p1">
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            data-oid="8m5hnwe"
                        >
                            <div className="flex items-center justify-between" data-oid="h6dty4c">
                                <div data-oid="ky9.lhp">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="62um3.-"
                                    >
                                        Total Value
                                    </h3>
                                    <p
                                        className="text-3xl font-bold text-[#1F1F6F]"
                                        data-oid="6.5lpwz"
                                    >
                                        {formatCurrency(stats.totalValue)}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="i_fmf0a">
                                        {stats.totalProducts} products
                                    </p>
                                </div>
                                <div className="text-3xl text-[#1F1F6F]" data-oid="tngg4rz">
                                    💰
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            data-oid="3donlb1"
                        >
                            <div className="flex items-center justify-between" data-oid="3as7s03">
                                <div data-oid="mhtwp_6">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="st5b0b9"
                                    >
                                        Low Stock
                                    </h3>
                                    <p
                                        className="text-3xl font-bold text-orange-600"
                                        data-oid="dth0vw7"
                                    >
                                        {stats.lowStockItems}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="dcl6u.p">
                                        Need attention
                                    </p>
                                </div>
                                <div className="text-3xl text-orange-600" data-oid=":pal1xs">
                                    ⚠️
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            data-oid=":u8yqba"
                        >
                            <div className="flex items-center justify-between" data-oid="t.r4byc">
                                <div data-oid="4.8lsdi">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="ovbh6dk"
                                    >
                                        Out of Stock
                                    </h3>
                                    <p
                                        className="text-3xl font-bold text-red-600"
                                        data-oid="4d:z_oh"
                                    >
                                        {stats.outOfStockItems}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="mk.waqb">
                                        Urgent restock
                                    </p>
                                </div>
                                <div className="text-3xl text-red-600" data-oid="79wyj_.">
                                    🚫
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            data-oid="discount-stats-card"
                        >
                            <div
                                className="flex items-center justify-between"
                                data-oid="discount-stats-inner"
                            >
                                <div data-oid="discount-stats-content">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="discount-stats-title"
                                    >
                                        With Discounts
                                    </h3>
                                    <p
                                        className="text-3xl font-bold text-purple-600"
                                        data-oid="discount-stats-count"
                                    >
                                        {
                                            vendorInventoryService.getDiscountStats(
                                                'vendor-pharmatech',
                                            ).totalWithDiscounts
                                        }
                                    </p>
                                    <p
                                        className="text-sm text-gray-600"
                                        data-oid="discount-stats-subtitle"
                                    >
                                        Active discounts
                                    </p>
                                </div>
                                <div
                                    className="text-3xl text-purple-600"
                                    data-oid="discount-stats-icon"
                                >
                                    🏷️
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            data-oid="7d-2szf"
                        >
                            <div className="flex items-center justify-between" data-oid="2-97ujb">
                                <div data-oid="g2ge1fi">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="x_pgm-:"
                                    >
                                        Stock Level
                                    </h3>
                                    <p
                                        className="text-3xl font-bold text-[#394867]"
                                        data-oid="_u98iry"
                                    >
                                        {stats.averageStockLevel.toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="s_ys:.e">
                                        Average level
                                    </p>
                                </div>
                                <div className="text-3xl text-[#394867]" data-oid="sjrh1:y">
                                    📊
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200"
                    data-oid="6.sadak"
                >
                    <div className="border-b border-gray-200" data-oid="v-9:d_7">
                        <nav className="flex space-x-8 px-6" data-oid="1bwts7-">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📊' },
                                { id: 'inventory', label: 'Inventory', icon: '📦' },
                                { id: 'movements', label: 'Movements', icon: '📋' },
                                { id: 'alerts', label: 'Alerts', icon: '🚨', count: alerts.length },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === tab.id
                                            ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    data-oid="wq3phww"
                                >
                                    <span className="mr-2" data-oid="6biowuw">
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                    {tab.count && tab.count > 0 && (
                                        <span
                                            className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                                            data-oid="nyfncxt"
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6" data-oid="4hexypy">
                        {activeTab === 'overview' && stats && (
                            <div className="space-y-6" data-oid="0xnwew7">
                                <h3
                                    className="text-lg font-semibold text-gray-900"
                                    data-oid="gqg:5ab"
                                >
                                    Inventory Overview
                                </h3>

                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="siv3sav"
                                >
                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="atk4:hx">
                                        <h4
                                            className="font-medium text-gray-900 mb-3"
                                            data-oid="0219hig"
                                        >
                                            Top Selling Products
                                        </h4>
                                        <div className="space-y-2" data-oid="2:rlvpc">
                                            {stats.topSellingProducts
                                                .slice(0, 5)
                                                .map((product, index) => (
                                                    <div
                                                        key={product.productId}
                                                        className="flex justify-between"
                                                        data-oid="mk943jq"
                                                    >
                                                        <span
                                                            className="text-gray-600 text-sm"
                                                            data-oid="qz8doac"
                                                        >
                                                            {index + 1}. {product.productName}
                                                        </span>
                                                        <span
                                                            className="font-medium text-sm"
                                                            data-oid="pit9uk0"
                                                        >
                                                            {product.totalSold} sold
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="t2m649e">
                                        <h4
                                            className="font-medium text-gray-900 mb-3"
                                            data-oid="0y0_0bu"
                                        >
                                            Category Breakdown
                                        </h4>
                                        <div className="space-y-2" data-oid="_c7ary.">
                                            {stats.categoryBreakdown.map((category) => (
                                                <div
                                                    key={category.category}
                                                    className="flex justify-between"
                                                    data-oid="5if85ll"
                                                >
                                                    <span
                                                        className="text-gray-600 text-sm"
                                                        data-oid="d5pqq:r"
                                                    >
                                                        {category.category}
                                                    </span>
                                                    <span
                                                        className="font-medium text-sm"
                                                        data-oid="0:c3zwj"
                                                    >
                                                        {category.productCount} products
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4" data-oid="l21:b15">
                                    <h4
                                        className="font-medium text-blue-900 mb-3"
                                        data-oid="7-0xhqh"
                                    >
                                        Inventory Metrics
                                    </h4>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        data-oid="87g07hz"
                                    >
                                        <div data-oid="1e:l55o">
                                            <span
                                                className="text-blue-700 text-sm"
                                                data-oid="lo2w_64"
                                            >
                                                Stock Turnover Rate:
                                            </span>
                                            <p
                                                className="font-semibold text-blue-900"
                                                data-oid="4nj48hx"
                                            >
                                                {stats.stockTurnoverRate.toFixed(2)}x
                                            </p>
                                        </div>
                                        <div data-oid="x41vvpx">
                                            <span
                                                className="text-blue-700 text-sm"
                                                data-oid="olpuw7q"
                                            >
                                                Expiring Soon:
                                            </span>
                                            <p
                                                className="font-semibold text-blue-900"
                                                data-oid=".b0lngs"
                                            >
                                                {stats.expiringSoonItems} items
                                            </p>
                                        </div>
                                        <div data-oid=".kp3ty3">
                                            <span
                                                className="text-blue-700 text-sm"
                                                data-oid="-.wsm9_"
                                            >
                                                Expired Items:
                                            </span>
                                            <p
                                                className="font-semibold text-blue-900"
                                                data-oid="--4.qhk"
                                            >
                                                {stats.expiredItems} items
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'inventory' && (
                            <div className="space-y-6" data-oid="m0dxab8">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="mfm4qk1"
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="n-2t7:5"
                                    >
                                        Inventory Items
                                    </h3>
                                    <button
                                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors duration-200"
                                        data-oid="m40n5g0"
                                    >
                                        Add New Product
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="bg-gray-50 rounded-lg p-4" data-oid="21v1c7i">
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                        data-oid="89ch19q"
                                    >
                                        <div data-oid="7f-m1ad">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="3--:.wu"
                                            >
                                                Category
                                            </label>
                                            <select
                                                value={filters.category || ''}
                                                onChange={(e) =>
                                                    setFilters({
                                                        ...filters,
                                                        category: e.target.value || undefined,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                                data-oid="fqg2f-_"
                                            >
                                                <option value="" data-oid="4-aknqz">
                                                    All Categories
                                                </option>
                                                {vendorInventoryService
                                                    .getCategories()
                                                    .map((category) => (
                                                        <option
                                                            key={category}
                                                            value={category}
                                                            data-oid="zumpq7:"
                                                        >
                                                            {category}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div data-oid="vnxtj5e">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="pohw:9v"
                                            >
                                                Stock Level
                                            </label>
                                            <select
                                                value={filters.stockLevel || 'all'}
                                                onChange={(e) =>
                                                    setFilters({
                                                        ...filters,
                                                        stockLevel: e.target.value as any,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                                data-oid="hqmq46p"
                                            >
                                                <option value="all" data-oid="13gq.z9">
                                                    All Levels
                                                </option>
                                                <option value="normal" data-oid="cncp3aw">
                                                    Normal Stock
                                                </option>
                                                <option value="low" data-oid="t-uzm2t">
                                                    Low Stock
                                                </option>
                                                <option value="out" data-oid="go4i89s">
                                                    Out of Stock
                                                </option>
                                                <option value="overstock" data-oid=":u3s01j">
                                                    Overstock
                                                </option>
                                            </select>
                                        </div>
                                        <div data-oid="gg0rtt:">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="v.8bfn:"
                                            >
                                                Sort By
                                            </label>
                                            <select
                                                value={filters.sortBy || 'name'}
                                                onChange={(e) =>
                                                    setFilters({
                                                        ...filters,
                                                        sortBy: e.target.value as any,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                                data-oid="t:x1s9b"
                                            >
                                                <option value="name" data-oid="rp0ja5z">
                                                    Name
                                                </option>
                                                <option value="stock" data-oid="4dihm.p">
                                                    Stock Level
                                                </option>
                                                <option value="value" data-oid="b1l:80u">
                                                    Total Value
                                                </option>
                                                <option value="lastRestocked" data-oid="bcr:41j">
                                                    Last Restocked
                                                </option>
                                                <option value="lastSold" data-oid="gsuu:zm">
                                                    Last Sold
                                                </option>
                                            </select>
                                        </div>
                                        <div data-oid="cpwgtt3">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="hwtnxo4"
                                            >
                                                Search
                                            </label>
                                            <input
                                                type="text"
                                                value={filters.search || ''}
                                                onChange={(e) =>
                                                    setFilters({
                                                        ...filters,
                                                        search: e.target.value || undefined,
                                                    })
                                                }
                                                placeholder="Search products..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                                data-oid="1.e0qa8"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Inventory Table */}
                                <div className="overflow-x-auto" data-oid="j9xlph1">
                                    <table className="w-full" data-oid="jqjb_if">
                                        <thead className="bg-gray-50" data-oid="gnhsr86">
                                            <tr data-oid="stvtnxn">
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="-nrllaz"
                                                >
                                                    Product
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="ny3xgyd"
                                                >
                                                    SKU
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="h3x6ehe"
                                                >
                                                    Stock
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="wefewpy"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="price-header"
                                                >
                                                    Price
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="discount-header"
                                                >
                                                    Discount
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="kdzd3zx"
                                                >
                                                    Value
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="fib:ce3"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            data-oid="03xefx0"
                                        >
                                            {inventoryItems.map((item) => {
                                                const hasDiscount =
                                                    vendorInventoryService.hasActiveDiscount(item);
                                                const discountBadge =
                                                    vendorInventoryService.formatDiscountBadge(
                                                        item,
                                                    );
                                                return (
                                                    <tr key={item.id} data-oid="xdaithe">
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="65ms2s2"
                                                        >
                                                            <div data-oid="5-afh20">
                                                                <div
                                                                    className="flex items-center space-x-2"
                                                                    data-oid="product-name-container"
                                                                >
                                                                    <div data-oid="product-info">
                                                                        <div
                                                                            className="text-sm font-medium text-gray-900"
                                                                            data-oid="pp-hshm"
                                                                        >
                                                                            {item.productName}
                                                                        </div>
                                                                        <div
                                                                            className="text-sm text-gray-500"
                                                                            data-oid="rtjdl_c"
                                                                        >
                                                                            {item.category} •{' '}
                                                                            {item.brand}
                                                                        </div>
                                                                    </div>
                                                                    {hasDiscount && (
                                                                        <span
                                                                            className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm animate-pulse"
                                                                            data-oid="discount-badge-inline"
                                                                        >
                                                                            🏷️ {discountBadge}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid="upbvmrq"
                                                        >
                                                            {item.sku}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="j:dh1ev"
                                                        >
                                                            <div
                                                                className="text-sm text-gray-900"
                                                                data-oid=":tsz0_k"
                                                            >
                                                                {item.currentStock} /{' '}
                                                                {item.maximumStock}
                                                            </div>
                                                            <div
                                                                className="text-xs text-gray-500"
                                                                data-oid="71bun-p"
                                                            >
                                                                Min: {item.minimumStock}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="ebgdi1k"
                                                        >
                                                            <span
                                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(item.status)}`}
                                                                data-oid="v9ff3hj"
                                                            >
                                                                {item.status.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="price-cell"
                                                        >
                                                            <div
                                                                className="flex flex-col"
                                                                data-oid="price-display"
                                                            >
                                                                <span
                                                                    className="text-sm font-semibold text-green-600"
                                                                    data-oid="current-price"
                                                                >
                                                                    {formatCurrency(
                                                                        hasDiscount &&
                                                                            item.discountPrice
                                                                            ? item.discountPrice
                                                                            : item.sellingPrice,
                                                                    )}
                                                                </span>
                                                                {hasDiscount &&
                                                                    item.originalPrice && (
                                                                        <span
                                                                            className="text-xs text-gray-500 line-through"
                                                                            data-oid="original-price"
                                                                        >
                                                                            {formatCurrency(
                                                                                item.originalPrice,
                                                                            )}
                                                                        </span>
                                                                    )}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="discount-cell"
                                                        >
                                                            {hasDiscount ? (
                                                                <div
                                                                    className="flex flex-col space-y-1"
                                                                    data-oid="discount-info"
                                                                >
                                                                    <span
                                                                        className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm w-fit"
                                                                        data-oid="discount-badge"
                                                                    >
                                                                        🏷️ {discountBadge}
                                                                    </span>
                                                                    <span
                                                                        className="text-xs text-gray-500"
                                                                        data-oid="discount-dates"
                                                                    >
                                                                        Until{' '}
                                                                        {new Date(
                                                                            item.discountEndDate!,
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span
                                                                    className="text-xs text-gray-400"
                                                                    data-oid="no-discount"
                                                                >
                                                                    No discount
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid="0w1hwl4"
                                                        >
                                                            {formatCurrency(item.totalValue)}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                                            data-oid="gb3jepo"
                                                        >
                                                            <div
                                                                className="flex space-x-2"
                                                                data-oid="huxnul6"
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        handleRestock(item)
                                                                    }
                                                                    className="text-[#1F1F6F] hover:text-[#14274E]"
                                                                    data-oid="6pos7vd"
                                                                >
                                                                    Restock
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdateStock(item)
                                                                    }
                                                                    className="text-gray-600 hover:text-gray-900"
                                                                    data-oid="hp1cv3k"
                                                                >
                                                                    Update
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'movements' && (
                            <div className="space-y-6" data-oid="lk8a_id">
                                <h3
                                    className="text-lg font-semibold text-gray-900"
                                    data-oid="jyc_by7"
                                >
                                    Stock Movements
                                </h3>

                                <div className="overflow-x-auto" data-oid="w5pcrsz">
                                    <table className="w-full" data-oid="hz59trn">
                                        <thead className="bg-gray-50" data-oid="k8x1wof">
                                            <tr data-oid="k8y1j08">
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="-06jgj1"
                                                >
                                                    Date
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="miowb2t"
                                                >
                                                    Product
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="w_i9wt:"
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="vbq8vdf"
                                                >
                                                    Quantity
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="k_127i0"
                                                >
                                                    Value
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="msr8g0e"
                                                >
                                                    Performed By
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            data-oid="mh.:avf"
                                        >
                                            {movements.slice(0, 20).map((movement) => (
                                                <tr key={movement.id} data-oid="pws9wn-">
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        data-oid="qxcschs"
                                                    >
                                                        {new Date(
                                                            movement.createdAt,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="2mxgl2y"
                                                    >
                                                        <div
                                                            className="text-sm font-medium text-gray-900"
                                                            data-oid="-mkp:.x"
                                                        >
                                                            {movement.productName}
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-500"
                                                            data-oid="mucav11"
                                                        >
                                                            {movement.reason}
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="fi0sb6u"
                                                    >
                                                        <span
                                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                movement.movementType === 'restock'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : movement.movementType ===
                                                                        'sale'
                                                                      ? 'bg-blue-100 text-blue-800'
                                                                      : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                            data-oid="cwz4s-n"
                                                        >
                                                            {movement.movementType}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="vi8so7o"
                                                    >
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                movement.quantity > 0
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }`}
                                                            data-oid="vie4lfm"
                                                        >
                                                            {movement.quantity > 0 ? '+' : ''}
                                                            {movement.quantity}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        data-oid="7mm4qb1"
                                                    >
                                                        {formatCurrency(
                                                            Math.abs(movement.totalValue),
                                                        )}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        data-oid="t6ei721"
                                                    >
                                                        {movement.performedBy}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'alerts' && (
                            <div className="space-y-6" data-oid=":u46d2i">
                                <h3
                                    className="text-lg font-semibold text-gray-900"
                                    data-oid="_ffjh1f"
                                >
                                    Inventory Alerts
                                </h3>

                                {alerts.length === 0 ? (
                                    <div className="text-center py-8" data-oid="qn3hahc">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="szc8i.r"
                                        >
                                            <span className="text-2xl" data-oid="tgkrdm1">
                                                ✅
                                            </span>
                                        </div>
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-2"
                                            data-oid="f0eurm4"
                                        >
                                            No Active Alerts
                                        </h3>
                                        <p className="text-gray-600" data-oid="ezvq__f">
                                            All inventory items are within normal levels.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4" data-oid="6yjj7aj">
                                        {alerts.map((alert) => (
                                            <div
                                                key={alert.id}
                                                className="bg-white border border-gray-200 rounded-lg p-4"
                                                data-oid="aiw9cz2"
                                            >
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="za_2ewx"
                                                >
                                                    <div className="flex-1" data-oid="b.tn3::">
                                                        <div
                                                            className="flex items-center space-x-2 mb-2"
                                                            data-oid="8rzhu6d"
                                                        >
                                                            <span
                                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(alert.priority)}`}
                                                                data-oid="1pc.uum"
                                                            >
                                                                {alert.priority}
                                                            </span>
                                                            <span
                                                                className="text-sm text-gray-500"
                                                                data-oid="bv.66.d"
                                                            >
                                                                {alert.alertType.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <h4
                                                            className="text-lg font-medium text-gray-900 mb-1"
                                                            data-oid="w0n4mq4"
                                                        >
                                                            {alert.productName}
                                                        </h4>
                                                        <p
                                                            className="text-gray-600 mb-2"
                                                            data-oid="9ymghaz"
                                                        >
                                                            {alert.message}
                                                        </p>
                                                        <div
                                                            className="text-sm text-gray-500"
                                                            data-oid="kxa5bbc"
                                                        >
                                                            Current Stock: {alert.currentStock}
                                                            {alert.threshold &&
                                                                ` • Threshold: ${alert.threshold}`}
                                                            {alert.expiryDate &&
                                                                ` • Expires: ${new Date(alert.expiryDate).toLocaleDateString()}`}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex space-x-2"
                                                        data-oid="p8u4ah0"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                vendorInventoryService.resolveAlert(
                                                                    alert.id,
                                                                    'Current User',
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-[#1F1F6F] text-white text-sm rounded hover:bg-[#14274E] transition-colors duration-200"
                                                            data-oid=":-x4fwp"
                                                        >
                                                            Resolve
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
