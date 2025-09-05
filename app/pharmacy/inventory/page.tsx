'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard, cardGradients } from '@/components/dashboard/DashboardCard';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import {
    pharmacyInventoryService,
    InventoryItem,
    InventoryFilters,
    InventoryStats,
    StockMovement,
} from '@/lib/services/pharmacyInventoryService';
import { LowStockAlertManager } from '@/components/pharmacy/LowStockAlertManager';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function PharmacyInventoryPage() {
    const { t } = useTranslation();
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'movements' | 'alerts'>(
        'overview',
    );
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState<InventoryFilters>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');

    // Form states
    const [restockForm, setRestockForm] = useState({
        quantity: '',
        supplier: '',
        batchNumber: '',
        expiryDate: '',
        costPrice: '',
        notes: '',
    });

    const [updateForm, setUpdateForm] = useState({
        quantity: '',
        reason: '',
        type: 'adjustment' as StockMovement['type'],
        notes: '',
    });

    useEffect(() => {
        loadInventoryData();

        // Subscribe to inventory updates
        const unsubscribe = pharmacyInventoryService.subscribe((items) => {
            setInventoryItems(items);
            setStats(pharmacyInventoryService.getInventoryStats());
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventoryItems, filters, searchQuery, statusFilter, categoryFilter, sortBy]);

    const loadInventoryData = () => {
        try {
            const items = pharmacyInventoryService.getInventoryItems();
            const inventoryStats = pharmacyInventoryService.getInventoryStats();
            const movements = pharmacyInventoryService.getStockMovements(undefined, 20);

            setInventoryItems(items);
            setStats(inventoryStats);
            setStockMovements(movements);
            setLoading(false);
        } catch (error) {
            console.error('Error loading inventory data:', error);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...inventoryItems];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((item) => {
                const product = pharmacyInventoryService.getProductDetails(item.productId);
                return (
                    product &&
                    (product.name.toLowerCase().includes(query) ||
                        product.nameAr.includes(searchQuery) ||
                        item.batchNumber.toLowerCase().includes(query) ||
                        item.supplier.toLowerCase().includes(query) ||
                        item.location.toLowerCase().includes(query))
                );
            });
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter((item) => {
                const product = pharmacyInventoryService.getProductDetails(item.productId);
                return product && product.category === categoryFilter;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const productA = pharmacyInventoryService.getProductDetails(a.productId);
            const productB = pharmacyInventoryService.getProductDetails(b.productId);

            switch (sortBy) {
                case 'name':
                    return (productA?.name || '').localeCompare(productB?.name || '');
                case 'stock':
                    return b.currentStock - a.currentStock;
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'expiry':
                    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
                case 'value':
                    return b.currentStock * b.sellingPrice - a.currentStock * a.sellingPrice;
                default:
                    return 0;
            }
        });

        setFilteredItems(filtered);
    };

    const handleRestock = async () => {
        if (!selectedItem) return;

        try {
            const success = await pharmacyInventoryService.restockItem(
                selectedItem.id,
                parseInt(restockForm.quantity),
                restockForm.supplier || undefined,
                restockForm.batchNumber || undefined,
                restockForm.expiryDate || undefined,
                parseFloat(restockForm.costPrice) || undefined,
                restockForm.notes || undefined,
            );

            if (success) {
                setShowRestockModal(false);
                setSelectedItem(null);
                setRestockForm({
                    quantity: '',
                    supplier: '',
                    batchNumber: '',
                    expiryDate: '',
                    costPrice: '',
                    notes: '',
                });
            }
        } catch (error) {
            console.error('Error restocking item:', error);
        }
    };

    const handleUpdateStock = async () => {
        if (!selectedItem) return;

        try {
            const success = await pharmacyInventoryService.updateStock(
                selectedItem.id,
                parseInt(updateForm.quantity),
                updateForm.type,
                updateForm.reason,
                undefined,
                updateForm.notes || undefined,
            );

            if (success) {
                setShowUpdateModal(false);
                setSelectedItem(null);
                setUpdateForm({
                    quantity: '',
                    reason: '',
                    type: 'adjustment',
                    notes: '',
                });
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-stock':
                return 'text-green-600 bg-green-100';
            case 'low-stock':
                return 'text-orange-600 bg-orange-100';
            case 'out-of-stock':
                return 'text-red-600 bg-red-100';
            case 'expired':
                return 'text-gray-600 bg-gray-100';
            case 'discontinued':
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toFixed(2)}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

    if (loading) {
        return (
            <DashboardLayout title="Inventory Management" userType="pharmacy" data-oid=".nehl1_">
                <div className="flex items-center justify-center h-64" data-oid="wt83qec">
                    <div className="text-center" data-oid="m22l-:z">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                            data-oid="0cewjje"
                        ></div>
                        <p className="text-gray-600" data-oid="0f.4ge5">
                            Loading inventory...
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Inventory Management" userType="pharmacy" data-oid="udm75an">
            <div className="space-y-6" data-oid="b7:.cia">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="jd4wh96">
                        <DashboardCard
                            title="Total Items"
                            value={stats.totalItems.toString()}
                            subtitle="Products in inventory"
                            gradient={cardGradients.primary}
                            icon="📦"
                            data-oid="d6voju1"
                        />

                        <DashboardCard
                            title="Low Stock Items"
                            value={stats.lowStockItems.toString()}
                            subtitle="Need restocking"
                            gradient={
                                stats.lowStockItems > 0
                                    ? cardGradients.warning
                                    : cardGradients.success
                            }
                            icon="⚠️"
                            onClick={() => {
                                setStatusFilter('low-stock');
                                setActiveTab('inventory');
                            }}
                            data-oid="s7hy.at"
                        />

                        <DashboardCard
                            title="Out of Stock"
                            value={stats.outOfStockItems.toString()}
                            subtitle="Urgent attention needed"
                            gradient={
                                stats.outOfStockItems > 0
                                    ? cardGradients.danger
                                    : cardGradients.success
                            }
                            icon="🚫"
                            onClick={() => {
                                setStatusFilter('out-of-stock');
                                setActiveTab('inventory');
                            }}
                            data-oid="h65hg3e"
                        />

                        <DashboardCard
                            title="Inventory Value"
                            value={formatCurrency(stats.totalValue)}
                            subtitle="Total stock value"
                            gradient={cardGradients.secondary}
                            icon="💰"
                            data-oid="15qz89w"
                        />
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl border border-gray-200" data-oid="sdd-mq0">
                    <div className="border-b border-gray-200" data-oid="vm7-l5l">
                        <nav className="flex space-x-8 px-6" data-oid="ucbupp8">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📊' },
                                { id: 'inventory', label: 'Inventory', icon: '📦' },
                                { id: 'movements', label: 'Stock Movements', icon: '📈' },
                                { id: 'alerts', label: 'Low Stock Alerts', icon: '🚨' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    data-oid="1xw-u.2"
                                >
                                    <span className="mr-2" data-oid="6uro427">
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6" data-oid="l7ymm.7">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && stats && (
                            <div className="space-y-6" data-oid="lks:k7p">
                                <div
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                    data-oid="vt5k:i3"
                                >
                                    {/* Quick Stats */}
                                    <DashboardWidget title="Quick Statistics" data-oid="1:8:pvy">
                                        <div className="space-y-4" data-oid="d4hk8h3">
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="t_nox5p"
                                            >
                                                <span className="text-gray-600" data-oid="rq._tj7">
                                                    In Stock Items:
                                                </span>
                                                <span
                                                    className="font-medium text-green-600"
                                                    data-oid="0ud416b"
                                                >
                                                    {stats.inStockItems}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="-kf5:2q"
                                            >
                                                <span className="text-gray-600" data-oid="0q2kw0v">
                                                    Expiring Soon (30 days):
                                                </span>
                                                <span
                                                    className="font-medium text-orange-600"
                                                    data-oid="8nx7gfg"
                                                >
                                                    {stats.expiringSoonItems}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="mkw1jw-"
                                            >
                                                <span className="text-gray-600" data-oid="_uhrbh3">
                                                    Reorder Required:
                                                </span>
                                                <span
                                                    className="font-medium text-red-600"
                                                    data-oid="2gdgarh"
                                                >
                                                    {stats.reorderRequiredItems}
                                                </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center"
                                                data-oid="e.s6o-r"
                                            >
                                                <span className="text-gray-600" data-oid="lz2bu7q">
                                                    Average Stock Level:
                                                </span>
                                                <span className="font-medium" data-oid="2tm_052">
                                                    {Math.round(stats.averageStockLevel)}
                                                </span>
                                            </div>
                                        </div>
                                    </DashboardWidget>

                                    {/* Recent Stock Movements */}
                                    <DashboardWidget
                                        title="Recent Stock Movements"
                                        action={{
                                            label: 'View All',
                                            onClick: () => setActiveTab('movements'),
                                        }}
                                        data-oid="t4q8k6b"
                                    >
                                        <div className="space-y-3" data-oid="3-:b0lr">
                                            {stockMovements.slice(0, 5).map((movement) => {
                                                const item =
                                                    pharmacyInventoryService.getInventoryItemById(
                                                        movement.inventoryItemId,
                                                    );
                                                const product = item
                                                    ? pharmacyInventoryService.getProductDetails(
                                                          item.productId,
                                                      )
                                                    : null;

                                                return (
                                                    <div
                                                        key={movement.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        data-oid="jwm.1wc"
                                                    >
                                                        <div data-oid="o3qhxfm">
                                                            <p
                                                                className="font-medium text-sm"
                                                                data-oid="xc_:r8-"
                                                            >
                                                                {product?.name || 'Unknown Product'}
                                                            </p>
                                                            <p
                                                                className="text-xs text-gray-500"
                                                                data-oid="s_hj0_b"
                                                            >
                                                                {movement.type} • {movement.reason}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="text-right"
                                                            data-oid="qz7qt59"
                                                        >
                                                            <p
                                                                className={`text-sm font-medium ${
                                                                    movement.type === 'restock' ||
                                                                    movement.type === 'returned'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }`}
                                                                data-oid="yjiha5-"
                                                            >
                                                                {movement.type === 'restock' ||
                                                                movement.type === 'returned'
                                                                    ? '+'
                                                                    : '-'}
                                                                {movement.quantity}
                                                            </p>
                                                            <p
                                                                className="text-xs text-gray-500"
                                                                data-oid="g5o7xjp"
                                                            >
                                                                {formatDate(movement.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </DashboardWidget>
                                </div>
                            </div>
                        )}

                        {/* Inventory Tab */}
                        {activeTab === 'inventory' && (
                            <div className="space-y-6" data-oid=".zypd7v">
                                {/* Filters */}
                                <div
                                    className="flex flex-wrap gap-4 items-center"
                                    data-oid="bsvtofg"
                                >
                                    <div className="flex-1 min-w-64" data-oid="4c8lfxx">
                                        <input
                                            type="text"
                                            placeholder="Search products, batch numbers, suppliers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            data-oid="dr69y_j"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        data-oid="1l:oynq"
                                    >
                                        <option value="all" data-oid="rcduv5r">
                                            All Status
                                        </option>
                                        <option value="in-stock" data-oid="ir_fiwx">
                                            In Stock
                                        </option>
                                        <option value="low-stock" data-oid="tbcecb_">
                                            Low Stock
                                        </option>
                                        <option value="out-of-stock" data-oid="-ze.iva">
                                            Out of Stock
                                        </option>
                                        <option value="expired" data-oid="vkh62o-">
                                            Expired
                                        </option>
                                    </select>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        data-oid="4l9l737"
                                    >
                                        <option value="all" data-oid="c2vewrg">
                                            All Categories
                                        </option>
                                        {pharmacyInventoryService
                                            .getCategories()
                                            .map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                    data-oid="mbqs:7s"
                                                >
                                                    {category.charAt(0).toUpperCase() +
                                                        category.slice(1)}
                                                </option>
                                            ))}
                                    </select>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        data-oid="vn43vof"
                                    >
                                        <option value="name" data-oid=":h:1cjo">
                                            Sort by Name
                                        </option>
                                        <option value="stock" data-oid="ndgf9-.">
                                            Sort by Stock
                                        </option>
                                        <option value="status" data-oid="a5n1cml">
                                            Sort by Status
                                        </option>
                                        <option value="expiry" data-oid="6ufifsd">
                                            Sort by Expiry
                                        </option>
                                        <option value="value" data-oid="9ky3lzd">
                                            Sort by Value
                                        </option>
                                    </select>
                                </div>

                                {/* Inventory Table */}
                                <div className="overflow-x-auto" data-oid="r3-pgo_">
                                    <table
                                        className="min-w-full divide-y divide-gray-200"
                                        data-oid="h5:h6_2"
                                    >
                                        <thead className="bg-gray-50" data-oid="l4xo0-o">
                                            <tr data-oid="tfrudiu">
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="0izr0jf"
                                                >
                                                    Product
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="drg6erf"
                                                >
                                                    Stock
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="9nj61f:"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="a90g0kb"
                                                >
                                                    Location
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="buh43s1"
                                                >
                                                    Expiry
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="f1hs7.:"
                                                >
                                                    Value
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="yg8c_sg"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            data-oid="gyz-wor"
                                        >
                                            {filteredItems.map((item) => {
                                                const product =
                                                    pharmacyInventoryService.getProductDetails(
                                                        item.productId,
                                                    );
                                                if (!product) return null;

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-gray-50"
                                                        data-oid="4l4vsya"
                                                    >
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="eydml-1"
                                                        >
                                                            <div data-oid="c:q0w0g">
                                                                <div
                                                                    className="text-sm font-medium text-gray-900"
                                                                    data-oid="vpddpfl"
                                                                >
                                                                    {product.name}
                                                                </div>
                                                                <div
                                                                    className="text-sm text-gray-500"
                                                                    data-oid="xiwx:5y"
                                                                >
                                                                    Batch: {item.batchNumber}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="0rwrbty"
                                                        >
                                                            <div
                                                                className="text-sm text-gray-900"
                                                                data-oid="7.52r1k"
                                                            >
                                                                {item.currentStock} /{' '}
                                                                {item.maxStockCapacity}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="7m8g1_x"
                                                            >
                                                                Min: {item.minStockThreshold}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="_:fem1b"
                                                        >
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                                                                data-oid="78x8h2m"
                                                            >
                                                                {item.status.replace('-', ' ')}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid=".4iyr34"
                                                        >
                                                            {item.location}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid="6gytock"
                                                        >
                                                            {formatDate(item.expiryDate)}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid="sge6.2k"
                                                        >
                                                            {formatCurrency(
                                                                item.currentStock *
                                                                    item.sellingPrice,
                                                            )}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                                                            data-oid="ibtq70o"
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItem(item);
                                                                    setRestockForm({
                                                                        ...restockForm,
                                                                        supplier: item.supplier,
                                                                        costPrice:
                                                                            item.costPrice.toString(),
                                                                    });
                                                                    setShowRestockModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                data-oid="deptpjn"
                                                            >
                                                                Restock
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItem(item);
                                                                    setUpdateForm({
                                                                        ...updateForm,
                                                                        quantity:
                                                                            item.currentStock.toString(),
                                                                    });
                                                                    setShowUpdateModal(true);
                                                                }}
                                                                className="text-green-600 hover:text-green-900"
                                                                data-oid="h0iy_r7"
                                                            >
                                                                Update
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-8" data-oid="5n5hwv5">
                                        <div className="text-4xl mb-4" data-oid="2c9nfo-">
                                            📦
                                        </div>
                                        <h3
                                            className="text-lg font-medium text-gray-900 mb-2"
                                            data-oid="qr20hmr"
                                        >
                                            No items found
                                        </h3>
                                        <p className="text-gray-500" data-oid="mdt5bym">
                                            Try adjusting your search or filter criteria.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stock Movements Tab */}
                        {activeTab === 'movements' && (
                            <div className="space-y-6" data-oid="8ik5j6h">
                                <div className="overflow-x-auto" data-oid="2q:.-1_">
                                    <table
                                        className="min-w-full divide-y divide-gray-200"
                                        data-oid="cum:jv8"
                                    >
                                        <thead className="bg-gray-50" data-oid="2wne.2w">
                                            <tr data-oid="302c:o4">
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="ozk02a1"
                                                >
                                                    Product
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="u7a1_:a"
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="tgpkzjw"
                                                >
                                                    Quantity
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="g9sfdqd"
                                                >
                                                    Stock Change
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="8lw0:po"
                                                >
                                                    Reason
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="bjn:5fm"
                                                >
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            data-oid=":6zb.nw"
                                        >
                                            {stockMovements.map((movement) => {
                                                const item =
                                                    pharmacyInventoryService.getInventoryItemById(
                                                        movement.inventoryItemId,
                                                    );
                                                const product = item
                                                    ? pharmacyInventoryService.getProductDetails(
                                                          item.productId,
                                                      )
                                                    : null;

                                                return (
                                                    <tr
                                                        key={movement.id}
                                                        className="hover:bg-gray-50"
                                                        data-oid="c_3myrt"
                                                    >
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="r1cic8q"
                                                        >
                                                            <div
                                                                className="text-sm font-medium text-gray-900"
                                                                data-oid=":p:_j7-"
                                                            >
                                                                {product?.name || 'Unknown Product'}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="p7tbif8"
                                                        >
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    movement.type === 'restock'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : movement.type === 'sale'
                                                                          ? 'bg-blue-100 text-blue-800'
                                                                          : movement.type ===
                                                                              'adjustment'
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                }`}
                                                                data-oid="5djghwq"
                                                            >
                                                                {movement.type}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid="ble9p:u"
                                                        >
                                                            {movement.quantity}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm"
                                                            data-oid="ptj8iz0"
                                                        >
                                                            <span
                                                                className={`font-medium ${
                                                                    movement.newStock >
                                                                    movement.previousStock
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }`}
                                                                data-oid="78od5f3"
                                                            >
                                                                {movement.previousStock} →{' '}
                                                                {movement.newStock}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            data-oid=":43p2ct"
                                                        >
                                                            {movement.reason}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                            data-oid="8a0bboy"
                                                        >
                                                            {formatDate(movement.timestamp)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Alerts Tab */}
                        {activeTab === 'alerts' && <LowStockAlertManager data-oid="_4miu_h" />}
                    </div>
                </div>

                {/* Restock Modal */}
                {showRestockModal && selectedItem && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        data-oid="2o4pyj."
                    >
                        <div className="bg-white rounded-xl p-6 w-full max-w-md" data-oid="x6:f6w6">
                            <h3 className="text-lg font-semibold mb-4" data-oid="5lw5vr4">
                                Restock{' '}
                                {
                                    pharmacyInventoryService.getProductDetails(
                                        selectedItem.productId,
                                    )?.name
                                }
                            </h3>
                            <div className="space-y-4" data-oid="03sg2ei">
                                <div data-oid="r.rha5g">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="uol9u_r"
                                    >
                                        Quantity to Add *
                                    </label>
                                    <input
                                        type="number"
                                        value={restockForm.quantity}
                                        onChange={(e) =>
                                            setRestockForm({
                                                ...restockForm,
                                                quantity: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter quantity"
                                        min="1"
                                        required
                                        data-oid="5zq5o-w"
                                    />
                                </div>
                                <div data-oid="s-04mt:">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="pqtonad"
                                    >
                                        Supplier
                                    </label>
                                    <input
                                        type="text"
                                        value={restockForm.supplier}
                                        onChange={(e) =>
                                            setRestockForm({
                                                ...restockForm,
                                                supplier: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Supplier name"
                                        data-oid="hf9yii2"
                                    />
                                </div>
                                <div data-oid="ihosv4g">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="tjd_uk9"
                                    >
                                        Batch Number
                                    </label>
                                    <input
                                        type="text"
                                        value={restockForm.batchNumber}
                                        onChange={(e) =>
                                            setRestockForm({
                                                ...restockForm,
                                                batchNumber: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Batch number"
                                        data-oid="qc-kque"
                                    />
                                </div>
                                <div data-oid="qtt81s7">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="5c:-y4c"
                                    >
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        value={restockForm.expiryDate}
                                        onChange={(e) =>
                                            setRestockForm({
                                                ...restockForm,
                                                expiryDate: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        data-oid="s2.sq1s"
                                    />
                                </div>
                                <div data-oid="56a.waa">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="efa-b6h"
                                    >
                                        Cost Price (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={restockForm.costPrice}
                                        onChange={(e) =>
                                            setRestockForm({
                                                ...restockForm,
                                                costPrice: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Cost price"
                                        data-oid="r5.ih.e"
                                    />
                                </div>
                                <div data-oid="ra1pt-a">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="6hz2rip"
                                    >
                                        Notes
                                    </label>
                                    <textarea
                                        value={restockForm.notes}
                                        onChange={(e) =>
                                            setRestockForm({
                                                ...restockForm,
                                                notes: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Additional notes"
                                        data-oid="7qjf7g4"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-6" data-oid="jimvoei">
                                <button
                                    onClick={handleRestock}
                                    disabled={!restockForm.quantity}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="-awyk.c"
                                >
                                    Restock
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRestockModal(false);
                                        setSelectedItem(null);
                                        setRestockForm({
                                            quantity: '',
                                            supplier: '',
                                            batchNumber: '',
                                            expiryDate: '',
                                            costPrice: '',
                                            notes: '',
                                        });
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                    data-oid="85.jfx-"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Stock Modal */}
                {showUpdateModal && selectedItem && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        data-oid="w93wvm."
                    >
                        <div className="bg-white rounded-xl p-6 w-full max-w-md" data-oid="865owya">
                            <h3 className="text-lg font-semibold mb-4" data-oid="kx9f.w6">
                                Update Stock -{' '}
                                {
                                    pharmacyInventoryService.getProductDetails(
                                        selectedItem.productId,
                                    )?.name
                                }
                            </h3>
                            <div className="space-y-4" data-oid="e475vcu">
                                <div data-oid="03kq_67">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="2d0_gzz"
                                    >
                                        New Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={updateForm.quantity}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                quantity: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter new quantity"
                                        min="0"
                                        required
                                        data-oid="au-3xsq"
                                    />

                                    <p className="text-sm text-gray-500 mt-1" data-oid="nvxqte4">
                                        Current stock: {selectedItem.currentStock}
                                    </p>
                                </div>
                                <div data-oid="8bxwqr3">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="4qvfeca"
                                    >
                                        Movement Type *
                                    </label>
                                    <select
                                        value={updateForm.type}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                type: e.target.value as StockMovement['type'],
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                        data-oid="n-mjigw"
                                    >
                                        <option value="adjustment" data-oid="vrcbnyz">
                                            Adjustment
                                        </option>
                                        <option value="damaged" data-oid="6zanox6">
                                            Damaged
                                        </option>
                                        <option value="expired" data-oid="dzug2at">
                                            Expired
                                        </option>
                                        <option value="returned" data-oid="m8.m6iw">
                                            Returned
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="ezwi8tf">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="hh8fm0v"
                                    >
                                        Reason *
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.reason}
                                        onChange={(e) =>
                                            setUpdateForm({ ...updateForm, reason: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Reason for stock update"
                                        required
                                        data-oid="-f.chq5"
                                    />
                                </div>
                                <div data-oid="ojri51u">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="opwno.s"
                                    >
                                        Notes
                                    </label>
                                    <textarea
                                        value={updateForm.notes}
                                        onChange={(e) =>
                                            setUpdateForm({ ...updateForm, notes: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Additional notes"
                                        data-oid="46a24f8"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-6" data-oid="xiim4-b">
                                <button
                                    onClick={handleUpdateStock}
                                    disabled={!updateForm.quantity || !updateForm.reason}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="r2jqzyy"
                                >
                                    Update Stock
                                </button>
                                <button
                                    onClick={() => {
                                        setShowUpdateModal(false);
                                        setSelectedItem(null);
                                        setUpdateForm({
                                            quantity: '',
                                            reason: '',
                                            type: 'adjustment',
                                            notes: '',
                                        });
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                    data-oid="e6ps-5t"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
