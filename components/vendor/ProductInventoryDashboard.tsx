'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Package, AlertTriangle, TrendingUp, Search, Filter } from 'lucide-react';
import { vendorInventoryService, VendorInventoryItem } from '@/lib/services/vendorInventoryService';

interface InventoryItem {
    id: string;
    name: string;
    nameArabic: string;
    sku: string;
    category: string;
    stock: number;
    price: string;
    originalPrice?: string;
    discountPercentage?: number;
    discountType?: 'percentage' | 'fixed' | 'none';
    discountStartDate?: string;
    discountEndDate?: string;
    expiry: string;
    batch: string;
    status: 'High' | 'Medium' | 'Low' | 'Out of Stock';
}

export function ProductInventoryDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [supplierFilter, setSupplierFilter] = useState('All Suppliers');
    const [stockFilter, setStockFilter] = useState('All Stock Levels');
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockItems: 0,
        outOfStock: 0,
        withDiscounts: 0,
    });

    useEffect(() => {
        loadInventoryData();
    }, []);

    const loadInventoryData = () => {
        const vendorId = 'vendor-pharmatech';
        const vendorItems = vendorInventoryService.getInventoryItems(vendorId);
        const discountStats = vendorInventoryService.getDiscountStats(vendorId);

        // Convert vendor inventory items to display format
        const displayItems: InventoryItem[] = vendorItems.slice(0, 10).map((item) => {
            const hasDiscount = vendorInventoryService.hasActiveDiscount(item);
            return {
                id: item.id,
                name: item.productName,
                nameArabic: item.productNameAr,
                sku: item.sku,
                category: item.category,
                stock: item.currentStock,
                price: `EGP ${hasDiscount && item.discountPrice ? item.discountPrice.toFixed(2) : item.sellingPrice.toFixed(2)}`,
                originalPrice:
                    hasDiscount && item.originalPrice
                        ? `EGP ${item.originalPrice.toFixed(2)}`
                        : undefined,
                discountPercentage: item.discountPercentage,
                discountType: item.discountType,
                discountStartDate: item.discountStartDate,
                discountEndDate: item.discountEndDate,
                expiry: item.expiryDate
                    ? new Date(item.expiryDate).toLocaleDateString('en-GB')
                    : 'N/A',
                batch: item.batchNumber || 'N/A',
                status:
                    item.currentStock > item.minimumStock
                        ? 'High'
                        : item.currentStock > 0
                          ? 'Medium'
                          : ('Out of Stock' as any),
            };
        });

        setInventoryItems(displayItems);
        setStats({
            totalProducts: vendorItems.length,
            lowStockItems: vendorItems.filter((item) => item.status === 'low_stock').length,
            outOfStock: vendorItems.filter((item) => item.status === 'out_of_stock').length,
            withDiscounts: discountStats.totalWithDiscounts,
        });
    };

    const refreshInventoryData = () => {
        vendorInventoryService.refreshInventoryData('vendor-pharmatech');
        loadInventoryData();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'High':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Out of Stock':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const hasActiveDiscount = (item: InventoryItem) => {
        if (item.discountType === 'none' || !item.discountStartDate || !item.discountEndDate) {
            return false;
        }
        const now = new Date();
        const startDate = new Date(item.discountStartDate);
        const endDate = new Date(item.discountEndDate);
        return now >= startDate && now <= endDate;
    };

    const formatDiscountBadge = (item: InventoryItem) => {
        if (!hasActiveDiscount(item)) return null;

        if (item.discountType === 'percentage' && item.discountPercentage) {
            return `${item.discountPercentage}% OFF`;
        }
        return 'DISCOUNT';
    };

    const filteredItems = inventoryItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nameArabic.includes(searchTerm) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === 'All Categories' || item.category === categoryFilter;
        const matchesStock =
            stockFilter === 'All Stock Levels' ||
            (stockFilter === 'High Stock' && item.status === 'High') ||
            (stockFilter === 'Medium Stock' && item.status === 'Medium') ||
            (stockFilter === 'Low Stock' && item.status === 'Low') ||
            (stockFilter === 'Out of Stock' && item.status === 'Out of Stock');

        return matchesSearch && matchesCategory && matchesStock;
    });

    const refreshInventoryData = () => {
        vendorInventoryService.refreshInventoryData('vendor-pharmatech');
        loadInventoryData();
    };

    return (
        <div className="space-y-6" data-oid="e612lmr">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl p-6"
                data-oid="_r23cq2"
            >
                <div className="flex items-center justify-between" data-oid="e:bt0cw">
                    <div data-oid="pdj-ci3">
                        <h1 className="text-2xl font-bold mb-2" data-oid=":yq-_-s">
                            Product Inventory
                        </h1>
                        <p className="text-lg opacity-90" data-oid="axm5ukx">
                            Manage your product inventory
                        </p>
                    </div>
                    <div className="text-right" data-oid="hld4d90">
                        <div className="flex space-x-3" data-oid="header-buttons">
                            <Button
                                onClick={refreshInventoryData}
                                className="bg-purple-600 text-white hover:bg-purple-700"
                                data-oid="refresh-discounts-btn"
                            >
                                🔄 Refresh Discounts
                            </Button>
                            <Button
                                className="bg-white text-[#1F1F6F] hover:bg-gray-100"
                                data-oid="dc576ww"
                            >
                                + Add Product
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="9qn6ucn">
                <Card className="bg-blue-50 border-blue-200" data-oid="6i6vp7w">
                    <CardContent className="p-6" data-oid="ssluwds">
                        <div className="flex items-center justify-between" data-oid="ons8l.m">
                            <div data-oid="zrtk5b-">
                                <h3
                                    className="text-lg font-semibold text-blue-900 mb-2"
                                    data-oid="ou6zv1t"
                                >
                                    Total Products
                                </h3>
                                <p className="text-3xl font-bold text-blue-600" data-oid=".f6imd2">
                                    {stats.totalProducts}
                                </p>
                            </div>
                            <Package className="w-12 h-12 text-blue-500" data-oid="bthi96o" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200" data-oid="discount-stats-card">
                    <CardContent className="p-6" data-oid="discount-stats-content">
                        <div
                            className="flex items-center justify-between"
                            data-oid="discount-stats-inner"
                        >
                            <div data-oid="discount-stats-text">
                                <h3
                                    className="text-lg font-semibold text-purple-900 mb-2"
                                    data-oid="discount-stats-title"
                                >
                                    With Discounts
                                </h3>
                                <p
                                    className="text-3xl font-bold text-purple-600"
                                    data-oid="discount-stats-count"
                                >
                                    {stats.withDiscounts}
                                </p>
                            </div>
                            <svg
                                className="w-12 h-12 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="discount-stats-icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2L13 9l7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200" data-oid="xe7aspp">
                    <CardContent className="p-6" data-oid=":ht-sjd">
                        <div className="flex items-center justify-between" data-oid="puk1de6">
                            <div data-oid="lo-mi69">
                                <h3
                                    className="text-lg font-semibold text-yellow-900 mb-2"
                                    data-oid="8t79ha-"
                                >
                                    Low Stock Items
                                </h3>
                                <p
                                    className="text-3xl font-bold text-yellow-600"
                                    data-oid="ui454b4"
                                >
                                    {stats.lowStockItems}
                                </p>
                            </div>
                            <AlertTriangle
                                className="w-12 h-12 text-yellow-500"
                                data-oid="r0j9t2e"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200" data-oid="pt9dbfp">
                    <CardContent className="p-6" data-oid="cj3btu5">
                        <div className="flex items-center justify-between" data-oid="m4-u2xn">
                            <div data-oid="c_o_0uk">
                                <h3
                                    className="text-lg font-semibold text-red-900 mb-2"
                                    data-oid="pgj-0_i"
                                >
                                    Out of Stock
                                </h3>
                                <p className="text-3xl font-bold text-red-600" data-oid="_98fzn4">
                                    {stats.outOfStock}
                                </p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-red-500" data-oid="e0i2vze" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Management Section */}
            <Card data-oid=".9fwa68">
                <CardHeader data-oid="cschxtz">
                    <div className="flex items-center justify-between" data-oid="6fq4.-i">
                        <div data-oid="nnyhoop">
                            <CardTitle data-oid="qiduzhd">Inventory Management</CardTitle>
                            <CardDescription data-oid="tbmu2v3">
                                {stats.totalProducts} items in your inventory
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent data-oid=".w:vw1h">
                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4" data-oid="wia8j_o">
                        <div className="flex flex-col md:flex-row gap-4" data-oid="_g5aqkl">
                            <div className="flex-1" data-oid="obu1pl8">
                                <div className="relative" data-oid="gtlmmn8">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                        data-oid="7tk-z7b"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search products, SKU, batch numbers..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        data-oid="4ymmjbo"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2" data-oid="va3-0_y">
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F]"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    data-oid="z7o7t81"
                                >
                                    <option value="All Categories" data-oid="xt8c0fp">
                                        All Categories
                                    </option>
                                    <option value="hygiene" data-oid="7psmcew">
                                        Hygiene
                                    </option>
                                    <option value="medical devices" data-oid="zvypk27">
                                        Medical Devices
                                    </option>
                                    <option value="medical" data-oid="t-6e8_l">
                                        Medical
                                    </option>
                                </select>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F]"
                                    value={supplierFilter}
                                    onChange={(e) => setSupplierFilter(e.target.value)}
                                    data-oid="e2awyw5"
                                >
                                    <option value="All Suppliers" data-oid=".w:o0y4">
                                        All Suppliers
                                    </option>
                                </select>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F]"
                                    value={stockFilter}
                                    onChange={(e) => setStockFilter(e.target.value)}
                                    data-oid="o9ztrhn"
                                >
                                    <option value="All Stock Levels" data-oid="5m5b_d9">
                                        All Stock Levels
                                    </option>
                                    <option value="High Stock" data-oid="z4zc9t2">
                                        High Stock
                                    </option>
                                    <option value="Medium Stock" data-oid="3ucec7-">
                                        Medium Stock
                                    </option>
                                    <option value="Low Stock" data-oid="zb03z26">
                                        Low Stock
                                    </option>
                                    <option value="Out of Stock" data-oid="mmpcv-k">
                                        Out of Stock
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="overflow-x-auto" data-oid="99es.q9">
                        <Table data-oid="kfbimxb">
                            <TableHeader data-oid="am8otyq">
                                <TableRow data-oid="yuf20kr">
                                    <TableHead className="w-8" data-oid="dd37c61">
                                        <input
                                            type="checkbox"
                                            className="rounded"
                                            data-oid="af.n9:8"
                                        />
                                    </TableHead>
                                    <TableHead data-oid="09ks29v">Product</TableHead>
                                    <TableHead data-oid="v_raq2u">SKU</TableHead>
                                    <TableHead data-oid=":dkhrgy">Category</TableHead>
                                    <TableHead data-oid="f1hcw2w">Stock</TableHead>
                                    <TableHead data-oid="ev5c5p5">Price</TableHead>
                                    <TableHead data-oid="discount-header-main">Discount</TableHead>
                                    <TableHead data-oid="0m0zfe-">Expiry</TableHead>
                                    <TableHead data-oid="bcfla8y">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody data-oid="-:_24m.">
                                {filteredItems.map((item) => {
                                    const hasDiscount = hasActiveDiscount(item);
                                    const discountBadge = formatDiscountBadge(item);
                                    return (
                                        <TableRow key={item.id} data-oid="3f2a1-4">
                                            <TableCell data-oid="hcl8:z1">
                                                <input
                                                    type="checkbox"
                                                    className="rounded"
                                                    data-oid="s3znt5k"
                                                />
                                            </TableCell>
                                            <TableCell data-oid="tlqha00">
                                                <div data-oid=".oltd_x">
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="product-name-container"
                                                    >
                                                        <div data-oid="product-names">
                                                            <div
                                                                className="font-medium text-gray-900"
                                                                data-oid="io_bny8"
                                                            >
                                                                {item.name}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="5uhcphf"
                                                            >
                                                                {item.nameArabic}
                                                            </div>
                                                        </div>
                                                        {hasDiscount && (
                                                            <Badge
                                                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs ml-2 animate-pulse"
                                                                data-oid="product-discount-badge"
                                                            >
                                                                🏷️ {discountBadge}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className="font-mono text-sm"
                                                data-oid="213_1v7"
                                            >
                                                {item.sku}
                                            </TableCell>
                                            <TableCell data-oid="ich_wn2">
                                                <Badge variant="secondary" data-oid="c_ygvdi">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell data-oid="y51ioy3">
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="j1v1hco"
                                                >
                                                    <span
                                                        className="font-medium"
                                                        data-oid="n:ib1ah"
                                                    >
                                                        {item.stock}
                                                    </span>
                                                    <Badge
                                                        className={getStatusColor(item.status)}
                                                        data-oid="bq:6p5a"
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="gxf8m_4">
                                                <div
                                                    className="flex flex-col"
                                                    data-oid="price-display"
                                                >
                                                    <span
                                                        className="font-semibold text-green-600"
                                                        data-oid="current-price-main"
                                                    >
                                                        {item.price}
                                                    </span>
                                                    {hasDiscount && item.originalPrice && (
                                                        <span
                                                            className="text-sm text-gray-500 line-through"
                                                            data-oid="original-price-main"
                                                        >
                                                            {item.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="discount-cell-main">
                                                {hasDiscount ? (
                                                    <div
                                                        className="flex flex-col space-y-1"
                                                        data-oid="discount-info-main"
                                                    >
                                                        <Badge
                                                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-fit"
                                                            data-oid="discount-badge-main"
                                                        >
                                                            🏷️ {discountBadge}
                                                        </Badge>
                                                        <span
                                                            className="text-xs text-gray-500"
                                                            data-oid="discount-dates-main"
                                                        >
                                                            Until{' '}
                                                            {new Date(
                                                                item.discountEndDate!,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className="text-sm text-gray-400"
                                                        data-oid="no-discount-main"
                                                    >
                                                        No discount
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell data-oid="7u5sqdu">
                                                <div data-oid="tiunbcs">
                                                    <div className="text-sm" data-oid="jkwfd:a">
                                                        {item.expiry}
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-500"
                                                        data-oid="k9j4a03"
                                                    >
                                                        {item.batch}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="x4__1s1">
                                                <div className="flex gap-2" data-oid="4mx5amc">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        data-oid="umeo75:"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        data-oid="oteb_jl"
                                                    >
                                                        •••
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
