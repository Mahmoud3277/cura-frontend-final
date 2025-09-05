'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Package,
    AlertTriangle,
    Search,
    TrendingDown,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
} from 'lucide-react';

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    discountType?: 'percentage' | 'fixed' | 'none';
    discountStartDate?: string;
    discountEndDate?: string;
    supplier: string;
    sku: string;
    location: string;
    lastUpdated: string;
}

export function VendorInventoryManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    // Mock inventory data for vendor
    const inventoryItems: InventoryItem[] = [
        {
            id: '1',
            name: 'Wireless Headphones',
            category: 'Electronics',
            currentStock: 8,
            minStock: 25,
            maxStock: 100,
            price: 360,
            originalPrice: 450,
            discountPercentage: 20,
            discountType: 'percentage',
            discountStartDate: '2024-01-10',
            discountEndDate: '2024-01-31',
            supplier: 'TechSupply Co.',
            sku: 'WH-2024001',
            location: 'A1-B2',
            lastUpdated: '2024-01-15 10:30',
        },
        {
            id: '2',
            name: 'Garden Hose Set',
            category: 'Home & Garden',
            currentStock: 12,
            minStock: 30,
            maxStock: 80,
            price: 180,
            discountType: 'none',
            supplier: 'Garden Plus',
            sku: 'GH-2024002',
            location: 'B2-C1',
            lastUpdated: '2024-01-14 15:45',
        },
        {
            id: '3',
            name: 'Yoga Mat Premium',
            category: 'Sports & Fitness',
            currentStock: 5,
            minStock: 20,
            maxStock: 50,
            price: 90,
            originalPrice: 120,
            discountPercentage: 25,
            discountType: 'percentage',
            discountStartDate: '2024-01-05',
            discountEndDate: '2024-02-05',
            supplier: 'FitLife',
            sku: 'YM-2024003',
            location: 'C1-D2',
            lastUpdated: '2024-01-13 09:15',
        },
        {
            id: '4',
            name: 'Face Moisturizer',
            category: 'Beauty & Personal Care',
            currentStock: 3,
            minStock: 15,
            maxStock: 60,
            price: 70,
            originalPrice: 85,
            discountPercentage: 15,
            discountType: 'percentage',
            discountStartDate: '2024-01-01',
            discountEndDate: '2024-01-25',
            supplier: 'BeautyWorld',
            sku: 'FM-2024004',
            location: 'D2-E1',
            lastUpdated: '2024-01-12 14:20',
        },
        {
            id: '5',
            name: 'Bluetooth Speaker',
            category: 'Electronics',
            currentStock: 2,
            minStock: 12,
            maxStock: 40,
            price: 320,
            discountType: 'none',
            supplier: 'TechSupply Co.',
            sku: 'BS-2024005',
            location: 'E1-F2',
            lastUpdated: '2024-01-11 11:10',
        },
        {
            id: '6',
            name: 'Smart Watch',
            category: 'Electronics',
            currentStock: 0,
            minStock: 15,
            maxStock: 50,
            price: 960,
            originalPrice: 1200,
            discountPercentage: 20,
            discountType: 'percentage',
            discountStartDate: '2024-01-08',
            discountEndDate: '2024-01-30',
            supplier: 'TechSupply Co.',
            sku: 'SW-2024006',
            location: 'A2-B1',
            lastUpdated: '2024-01-10 16:30',
        },
    ];

    const categories = [
        'all',
        'Electronics',
        'Home & Garden',
        'Sports & Fitness',
        'Beauty & Personal Care',
        'Fashion & Accessories',
    ];

    const getStockStatus = (item: InventoryItem) => {
        if (item.currentStock === 0) return 'out';
        if (item.currentStock <= item.minStock) return 'low';
        if (item.currentStock >= item.maxStock * 0.8) return 'high';
        return 'normal';
    };

    const getStockStatusColor = (status: string) => {
        switch (status) {
            case 'out':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'low':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'high':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getStockStatusText = (status: string) => {
        switch (status) {
            case 'out':
                return 'Out of Stock';
            case 'low':
                return 'Low Stock';
            case 'high':
                return 'High Stock';
            default:
                return 'Normal';
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
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const status = getStockStatus(item);
        const matchesStock =
            stockFilter === 'all' ||
            (stockFilter === 'low' && (status === 'low' || status === 'out')) ||
            (stockFilter === 'normal' && status === 'normal') ||
            (stockFilter === 'high' && status === 'high');

        return matchesSearch && matchesCategory && matchesStock;
    });

    const stockSummary = {
        total: inventoryItems.length,
        outOfStock: inventoryItems.filter((item) => getStockStatus(item) === 'out').length,
        lowStock: inventoryItems.filter((item) => getStockStatus(item) === 'low').length,
        normalStock: inventoryItems.filter((item) => getStockStatus(item) === 'normal').length,
        highStock: inventoryItems.filter((item) => getStockStatus(item) === 'high').length,
        withDiscounts: inventoryItems.filter((item) => hasActiveDiscount(item)).length,
    };

    return (
        <div className="space-y-6" data-oid="j6rj.zt">
            {/* Header */}
            <div data-oid="vvoa8x2">
                <h2 className="text-2xl font-bold text-gray-900" data-oid="2q1s2.c">
                    Inventory Management
                </h2>
                <p className="text-gray-600" data-oid="e_3m7d4">
                    Manage your vendor stock and inventory
                </p>
            </div>

            {/* Stock Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4" data-oid="15beslz">
                <Card data-oid="63jiji7">
                    <CardContent className="p-4" data-oid=":w95nse">
                        <div className="flex items-center justify-between" data-oid=".0u7_y2">
                            <div data-oid="_ejcrj7">
                                <p className="text-sm text-gray-600" data-oid="5s4-3_n">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="ejgju0r">
                                    {stockSummary.total}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-blue-500" data-oid="6henrke" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="discount-summary-card">
                    <CardContent className="p-4" data-oid="discount-card-content">
                        <div
                            className="flex items-center justify-between"
                            data-oid="discount-card-inner"
                        >
                            <div data-oid="discount-text">
                                <p className="text-sm text-gray-600" data-oid="discount-label">
                                    With Discounts
                                </p>
                                <p
                                    className="text-2xl font-bold text-purple-600"
                                    data-oid="discount-count"
                                >
                                    {stockSummary.withDiscounts}
                                </p>
                            </div>
                            <svg
                                className="w-8 h-8 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="discount-icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2L13 9l7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"
                                    clipRule="evenodd"
                                    data-oid="60xq5rn"
                                />
                            </svg>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="b:qo:vn">
                    <CardContent className="p-4" data-oid=".o6n1-m">
                        <div className="flex items-center justify-between" data-oid="mprmnjj">
                            <div data-oid="68wr7no">
                                <p className="text-sm text-gray-600" data-oid="h-rc9uq">
                                    Out of Stock
                                </p>
                                <p className="text-2xl font-bold text-red-600" data-oid="7t.mbnj">
                                    {stockSummary.outOfStock}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" data-oid="0z-5-zo" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="110o-j.">
                    <CardContent className="p-4" data-oid="n-o9h_a">
                        <div className="flex items-center justify-between" data-oid="lhxzsnc">
                            <div data-oid="b8n3xy_">
                                <p className="text-sm text-gray-600" data-oid="x.tzf-4">
                                    Low Stock
                                </p>
                                <p
                                    className="text-2xl font-bold text-orange-600"
                                    data-oid="3q8x:h9"
                                >
                                    {stockSummary.lowStock}
                                </p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-orange-500" data-oid="e7c3xud" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="9vn29qe">
                    <CardContent className="p-4" data-oid="mff9vea">
                        <div className="flex items-center justify-between" data-oid="fcn6pi1">
                            <div data-oid="1kw7o1q">
                                <p className="text-sm text-gray-600" data-oid="hg-wli-">
                                    Normal Stock
                                </p>
                                <p className="text-2xl font-bold text-blue-600" data-oid="84k4-.y">
                                    {stockSummary.normalStock}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-blue-500" data-oid="tnjm84a" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="uxu1mgm">
                    <CardContent className="p-4" data-oid=".avwcq2">
                        <div className="flex items-center justify-between" data-oid="1v7eovk">
                            <div data-oid="zy4z3:r">
                                <p className="text-sm text-gray-600" data-oid=".53mz5m">
                                    High Stock
                                </p>
                                <p className="text-2xl font-bold text-green-600" data-oid="47_4:8f">
                                    {stockSummary.highStock}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500" data-oid="85d-::f" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {(stockSummary.outOfStock > 0 || stockSummary.lowStock > 0) && (
                <div className="grid gap-4 md:grid-cols-2" data-oid="qyikchh">
                    {stockSummary.outOfStock > 0 && (
                        <Alert className="border-red-200 bg-red-50" data-oid="ocxdvve">
                            <AlertTriangle className="h-4 w-4 text-red-600" data-oid="ozbqoum" />

                            <AlertTitle className="text-red-800" data-oid="2j548qt">
                                Critical Stock Alert
                            </AlertTitle>
                            <AlertDescription className="text-red-700" data-oid="e68-lw8">
                                {stockSummary.outOfStock} items are completely out of stock
                            </AlertDescription>
                        </Alert>
                    )}

                    {stockSummary.lowStock > 0 && (
                        <Alert className="border-orange-200 bg-orange-50" data-oid=":ftba_0">
                            <AlertCircle className="h-4 w-4 text-orange-600" data-oid="b7xtdd-" />

                            <AlertTitle className="text-orange-800" data-oid="t06p67t">
                                Low Stock Warning
                            </AlertTitle>
                            <AlertDescription className="text-orange-700" data-oid="8gdfirl">
                                {stockSummary.lowStock} items need to be restocked soon
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            {/* Inventory Tools Tabs */}
            <Tabs defaultValue="inventory" className="space-y-4" data-oid="6awk-bk">
                <TabsList data-oid="2_dwlxj">
                    <TabsTrigger value="inventory" data-oid="i8ywcbg">
                        Inventory List
                    </TabsTrigger>
                    <TabsTrigger value="analytics" data-oid="ondb-.f">
                        Stock Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4" data-oid="yyw47bb">
                    {/* Search and Filters */}
                    <Card data-oid="v7rth98">
                        <CardContent className="p-4" data-oid="xpay:.z">
                            <div className="flex flex-col md:flex-row gap-4" data-oid="s4lnxrc">
                                <div className="flex-1" data-oid="se9cmtl">
                                    <div className="relative" data-oid="-_f1aqx">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                            data-oid="5p-bb7z"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Search items by name or category..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            data-oid="zclgt6l"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2" data-oid=":ld1hkm">
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        data-oid="l3t_nk8"
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                                data-oid="vk.wj9h"
                                            >
                                                {category === 'all' ? 'All Categories' : category}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        data-oid="4qjwlho"
                                    >
                                        <option value="all" data-oid="j--ch3c">
                                            All Stock Levels
                                        </option>
                                        <option value="low" data-oid="nd:5fej">
                                            Low/Out of Stock
                                        </option>
                                        <option value="normal" data-oid="k5e0su-">
                                            Normal Stock
                                        </option>
                                        <option value="high" data-oid="vwh69sx">
                                            High Stock
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory Table */}
                    <Card data-oid="q5e7mbb">
                        <CardHeader data-oid="ako0-pw">
                            <CardTitle data-oid="60dqnfz">
                                Inventory Items ({filteredItems.length})
                            </CardTitle>
                            <CardDescription data-oid="pkjdj6_">
                                Manage your vendor inventory
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="cwxwe7n">
                            <Table data-oid="byxhmmt">
                                <TableHeader data-oid="ae:1:7f">
                                    <TableRow data-oid="09cm98a">
                                        <TableHead data-oid="7chwqwa">Item Name</TableHead>
                                        <TableHead data-oid="8m4aj3n">Category</TableHead>
                                        <TableHead data-oid="hu.mgae">Current Stock</TableHead>
                                        <TableHead data-oid="5szzwyz">Min/Max</TableHead>
                                        <TableHead data-oid="0byjm1f">Price (EGP)</TableHead>
                                        <TableHead data-oid="discount-header">Discount</TableHead>
                                        <TableHead data-oid="40m8f9l">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="-0nsz1w">
                                    {filteredItems.map((item) => {
                                        const status = getStockStatus(item);
                                        const hasDiscount = hasActiveDiscount(item);
                                        const discountBadge = formatDiscountBadge(item);
                                        return (
                                            <TableRow key={item.id} data-oid="z26eljg">
                                                <TableCell
                                                    className="font-medium"
                                                    data-oid="x8xz8n0"
                                                >
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="item-name-container"
                                                    >
                                                        <span data-oid="item-name">
                                                            {item.name}
                                                        </span>
                                                        {hasDiscount && (
                                                            <Badge
                                                                className="bg-purple-100 text-purple-800 border-purple-200 text-xs"
                                                                data-oid="discount-badge-inline"
                                                            >
                                                                {discountBadge}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell data-oid=":rrsnkh">
                                                    {item.category}
                                                </TableCell>
                                                <TableCell data-oid="4u6jvf5">
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="_ukxw-6"
                                                    >
                                                        <span
                                                            className="font-semibold"
                                                            data-oid="rw7_aw2"
                                                        >
                                                            {item.currentStock}
                                                        </span>
                                                        <Progress
                                                            value={
                                                                (item.currentStock /
                                                                    item.maxStock) *
                                                                100
                                                            }
                                                            className="w-16 h-2"
                                                            data-oid="y3lidtn"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell data-oid="0eutlch">
                                                    <span
                                                        className="text-sm text-gray-600"
                                                        data-oid="dd7nn83"
                                                    >
                                                        {item.minStock} / {item.maxStock}
                                                    </span>
                                                </TableCell>
                                                <TableCell data-oid="w35_q:k">
                                                    <div
                                                        className="flex flex-col"
                                                        data-oid="price-container"
                                                    >
                                                        <span
                                                            className="font-semibold text-green-600"
                                                            data-oid="current-price"
                                                        >
                                                            {item.price} EGP
                                                        </span>
                                                        {hasDiscount && item.originalPrice && (
                                                            <span
                                                                className="text-sm text-gray-500 line-through"
                                                                data-oid="original-price"
                                                            >
                                                                {item.originalPrice} EGP
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell data-oid="discount-cell">
                                                    {hasDiscount ? (
                                                        <div
                                                            className="flex flex-col space-y-1"
                                                            data-oid="discount-info"
                                                        >
                                                            <Badge
                                                                className="bg-purple-100 text-purple-800 border-purple-200 w-fit"
                                                                data-oid="discount-badge"
                                                            >
                                                                {discountBadge}
                                                            </Badge>
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
                                                            className="text-sm text-gray-400"
                                                            data-oid="no-discount"
                                                        >
                                                            No discount
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell data-oid="vzfx0:1">
                                                    <Badge
                                                        className={getStockStatusColor(status)}
                                                        data-oid="7bae-7p"
                                                    >
                                                        {getStockStatusText(status)}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4" data-oid="ux.helx">
                    <Card data-oid="v3v-c2r">
                        <CardHeader data-oid="-d6e_os">
                            <CardTitle data-oid="9_74ldn">Stock Analytics</CardTitle>
                            <CardDescription data-oid="kqzm_4i">
                                Analyze your inventory performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="m:zkddq">
                            <div className="text-center py-8" data-oid="zha6c9k">
                                <div className="text-6xl mb-4" data-oid="veylic1">
                                    📊
                                </div>
                                <h3
                                    className="text-lg font-medium text-gray-900 mb-2"
                                    data-oid="hiw5ghh"
                                >
                                    Analytics Coming Soon
                                </h3>
                                <p className="text-gray-600" data-oid="uly46fm">
                                    Detailed inventory analytics will be available here.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
