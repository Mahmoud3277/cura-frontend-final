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
    supplier: string;
    expiryDate: string;
    batchNumber: string;
    location: string;
    lastUpdated: string;
}

export function InventoryManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    // Mock inventory data
    const inventoryItems: InventoryItem[] = [
        {
            id: '1',
            name: 'Paracetamol 500mg',
            category: 'Pain Relief',
            currentStock: 5,
            minStock: 20,
            maxStock: 100,
            price: 15,
            supplier: 'PharmaCorp',
            expiryDate: '2025-06-15',
            batchNumber: 'PC2024001',
            location: 'A1-B2',
            lastUpdated: '2024-01-15 10:30',
        },
        {
            id: '2',
            name: 'Amoxicillin 250mg',
            category: 'Antibiotics',
            currentStock: 8,
            minStock: 15,
            maxStock: 80,
            price: 45,
            supplier: 'MediSupply',
            expiryDate: '2024-12-20',
            batchNumber: 'MS2024002',
            location: 'B2-C1',
            lastUpdated: '2024-01-14 15:45',
        },
        {
            id: '3',
            name: 'Vitamin D3 1000IU',
            category: 'Vitamins',
            currentStock: 3,
            minStock: 10,
            maxStock: 50,
            price: 25,
            supplier: 'VitaHealth',
            expiryDate: '2025-03-10',
            batchNumber: 'VH2024003',
            location: 'C1-D2',
            lastUpdated: '2024-01-13 09:15',
        },
        {
            id: '4',
            name: 'Blood Pressure Monitor',
            category: 'Medical Devices',
            currentStock: 2,
            minStock: 5,
            maxStock: 20,
            price: 350,
            supplier: 'MedTech',
            expiryDate: 'N/A',
            batchNumber: 'MT2024004',
            location: 'D2-E1',
            lastUpdated: '2024-01-12 14:20',
        },
        {
            id: '5',
            name: 'Insulin Pen',
            category: 'Diabetes Care',
            currentStock: 1,
            minStock: 8,
            maxStock: 30,
            price: 120,
            supplier: 'DiabetesSupply',
            expiryDate: '2024-08-30',
            batchNumber: 'DS2024005',
            location: 'E1-F2',
            lastUpdated: '2024-01-11 11:10',
        },
        {
            id: '6',
            name: 'Aspirin 100mg',
            category: 'Pain Relief',
            currentStock: 0,
            minStock: 25,
            maxStock: 100,
            price: 12,
            supplier: 'PharmaCorp',
            expiryDate: '2024-11-15',
            batchNumber: 'PC2024006',
            location: 'A2-B1',
            lastUpdated: '2024-01-10 16:30',
        },
    ];

    const categories = [
        'all',
        'Pain Relief',
        'Antibiotics',
        'Vitamins',
        'Medical Devices',
        'Diabetes Care',
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
    };

    const expiringItems = inventoryItems.filter((item) => {
        if (item.expiryDate === 'N/A') return false;
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });

    return (
        <div className="space-y-6" data-oid="ujvia_4">
            {/* Header */}
            <div data-oid="4q7sc_k">
                <h2 className="text-2xl font-bold text-gray-900" data-oid="suucs50">
                    Inventory Management
                </h2>
                <p className="text-gray-600" data-oid="apmgs3s">
                    Manage your pharmacy stock and inventory
                </p>
            </div>

            {/* Stock Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4" data-oid="lssr9w:">
                <Card data-oid="ch5mzcm">
                    <CardContent className="p-4" data-oid="se79ozx">
                        <div className="flex items-center justify-between" data-oid="ge74vyb">
                            <div data-oid="o1lit54">
                                <p className="text-sm text-gray-600" data-oid="5.r3iy2">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="_xoyi4y">
                                    {stockSummary.total}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-blue-500" data-oid=".-yt_4a" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="7w4owpy">
                    <CardContent className="p-4" data-oid="okiifij">
                        <div className="flex items-center justify-between" data-oid="ggezlwv">
                            <div data-oid="f2s3qg8">
                                <p className="text-sm text-gray-600" data-oid="r3stvw-">
                                    Out of Stock
                                </p>
                                <p className="text-2xl font-bold text-red-600" data-oid="x5nf4dd">
                                    {stockSummary.outOfStock}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" data-oid="-efgtxv" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="2en43w2">
                    <CardContent className="p-4" data-oid="lqrs8ez">
                        <div className="flex items-center justify-between" data-oid="x-m0x_z">
                            <div data-oid="idjj825">
                                <p className="text-sm text-gray-600" data-oid="7c3_4ho">
                                    Low Stock
                                </p>
                                <p
                                    className="text-2xl font-bold text-orange-600"
                                    data-oid="sh3b0jf"
                                >
                                    {stockSummary.lowStock}
                                </p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-orange-500" data-oid="68maeit" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="ml:y2zx">
                    <CardContent className="p-4" data-oid="p7prem9">
                        <div className="flex items-center justify-between" data-oid="iz.wvvt">
                            <div data-oid="8szu9hd">
                                <p className="text-sm text-gray-600" data-oid="2d-t3mq">
                                    Normal Stock
                                </p>
                                <p className="text-2xl font-bold text-blue-600" data-oid="zkn9-35">
                                    {stockSummary.normalStock}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-blue-500" data-oid="-v5mjha" />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="65jnhyn">
                    <CardContent className="p-4" data-oid="g41ya.y">
                        <div className="flex items-center justify-between" data-oid="7k-4z.i">
                            <div data-oid="c0nkvah">
                                <p className="text-sm text-gray-600" data-oid="l7k8w1q">
                                    High Stock
                                </p>
                                <p className="text-2xl font-bold text-green-600" data-oid="0hm-z2i">
                                    {stockSummary.highStock}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500" data-oid="7.vzkrr" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {(stockSummary.outOfStock > 0 ||
                stockSummary.lowStock > 0 ||
                expiringItems.length > 0) && (
                <div className="grid gap-4 md:grid-cols-3" data-oid="je1s_pe">
                    {stockSummary.outOfStock > 0 && (
                        <Alert className="border-red-200 bg-red-50" data-oid="gjqtjt0">
                            <AlertTriangle className="h-4 w-4 text-red-600" data-oid="ez74.7i" />
                            <AlertTitle className="text-red-800" data-oid="6fy0q6n">
                                Critical Stock Alert
                            </AlertTitle>
                            <AlertDescription className="text-red-700" data-oid="ipwjm43">
                                {stockSummary.outOfStock} items are completely out of stock
                            </AlertDescription>
                        </Alert>
                    )}

                    {stockSummary.lowStock > 0 && (
                        <Alert className="border-orange-200 bg-orange-50" data-oid="n9i4eyp">
                            <AlertCircle className="h-4 w-4 text-orange-600" data-oid="5x1k7cv" />
                            <AlertTitle className="text-orange-800" data-oid="ui40bbm">
                                Low Stock Warning
                            </AlertTitle>
                            <AlertDescription className="text-orange-700" data-oid="slh:ojm">
                                {stockSummary.lowStock} items need to be restocked soon
                            </AlertDescription>
                        </Alert>
                    )}

                    {expiringItems.length > 0 && (
                        <Alert className="border-yellow-200 bg-yellow-50" data-oid="fa_nyr:">
                            <Clock className="h-4 w-4 text-yellow-600" data-oid="3evwqdj" />
                            <AlertTitle className="text-yellow-800" data-oid="y6gvfv3">
                                Expiry Alert
                            </AlertTitle>
                            <AlertDescription className="text-yellow-700" data-oid="3mc0y4y">
                                {expiringItems.length} items expire within 30 days
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            {/* Inventory Tools Tabs */}
            <Tabs defaultValue="inventory" className="space-y-4" data-oid="vjr3sxo">
                <TabsList data-oid="2eu3wny">
                    <TabsTrigger value="inventory" data-oid="5cykdes">
                        Inventory List
                    </TabsTrigger>
                    <TabsTrigger value="expiry" data-oid="a5g0rva">
                        Expiry Tracker
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4" data-oid="8smclr:">
                    {/* Search and Filters */}
                    <Card data-oid="2efc86m">
                        <CardContent className="p-4" data-oid="2ob8k8o">
                            <div className="flex flex-col md:flex-row gap-4" data-oid="kd17e.b">
                                <div className="flex-1" data-oid="0qn_4s:">
                                    <div className="relative" data-oid="zedra_4">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                            data-oid="i2:gcqb"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Search items by name or category..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            data-oid="r44bdlc"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2" data-oid="-6jq7kz">
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        data-oid="9yz2m:z"
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                                data-oid="-pe3tl-"
                                            >
                                                {category === 'all' ? 'All Categories' : category}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        data-oid="bi0ryma"
                                    >
                                        <option value="all" data-oid="l5mdxv8">
                                            All Stock Levels
                                        </option>
                                        <option value="low" data-oid="z6nc6a.">
                                            Low/Out of Stock
                                        </option>
                                        <option value="normal" data-oid="uw1i73q">
                                            Normal Stock
                                        </option>
                                        <option value="high" data-oid="di.6ov0">
                                            High Stock
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory Table */}
                    <Card data-oid="i:ew8js">
                        <CardHeader data-oid="1_02htp">
                            <CardTitle data-oid="3m5_eke">
                                Inventory Items ({filteredItems.length})
                            </CardTitle>
                            <CardDescription data-oid="ev-o9pv">
                                Manage your pharmacy inventory
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="lywp0zj">
                            <Table data-oid="cmi7dcj">
                                <TableHeader data-oid="_59-uul">
                                    <TableRow data-oid="lsh_vi6">
                                        <TableHead data-oid="bfqijcj">Item Name</TableHead>
                                        <TableHead data-oid="o.jro.k">Category</TableHead>
                                        <TableHead data-oid="hfd8.tx">Current Stock</TableHead>
                                        <TableHead data-oid="glxkx9p">Min/Max</TableHead>
                                        <TableHead data-oid="rcn5a:j">Price (EGP)</TableHead>
                                        <TableHead data-oid="d959-z2">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="81m-r.5">
                                    {filteredItems.map((item) => {
                                        const status = getStockStatus(item);
                                        return (
                                            <TableRow key={item.id} data-oid="1xvkw:r">
                                                <TableCell
                                                    className="font-medium"
                                                    data-oid="63iq0:w"
                                                >
                                                    {item.name}
                                                </TableCell>
                                                <TableCell data-oid="a_ukd3b">
                                                    {item.category}
                                                </TableCell>
                                                <TableCell data-oid=":h_-h_a">
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="illpb4u"
                                                    >
                                                        <span
                                                            className="font-semibold"
                                                            data-oid="qvu:ksf"
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
                                                            data-oid="2kz50ue"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell data-oid="f5nblrh">
                                                    <span
                                                        className="text-sm text-gray-600"
                                                        data-oid="l805.l8"
                                                    >
                                                        {item.minStock} / {item.maxStock}
                                                    </span>
                                                </TableCell>
                                                <TableCell data-oid="c3czgsl">
                                                    {item.price}
                                                </TableCell>
                                                <TableCell data-oid="6-3s:g_">
                                                    <Badge
                                                        className={getStockStatusColor(status)}
                                                        data-oid="n9ls7.v"
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

                <TabsContent value="expiry" className="space-y-4" data-oid="07di_rm">
                    <Card data-oid="p5.o:t_">
                        <CardHeader data-oid="3l5gr_7">
                            <CardTitle data-oid="rxnkvyw">Expiry Tracker</CardTitle>
                            <CardDescription data-oid="upqc2.3">
                                Monitor items approaching expiration
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="nwc1:_q">
                            <Table data-oid=":2byf70">
                                <TableHeader data-oid="lm56meb">
                                    <TableRow data-oid="s8_-m2z">
                                        <TableHead data-oid="bv2em2j">Item Name</TableHead>
                                        <TableHead data-oid="yaysu-a">Batch Number</TableHead>
                                        <TableHead data-oid="ad9l8f4">Current Stock</TableHead>
                                        <TableHead data-oid="ufyt42b">Expiry Date</TableHead>
                                        <TableHead data-oid="49zm2fn">Days Remaining</TableHead>
                                        <TableHead data-oid="w9e8vcf">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="a.21fj1">
                                    {expiringItems.map((item) => {
                                        const expiryDate = new Date(item.expiryDate);
                                        const today = new Date();
                                        const daysRemaining = Math.ceil(
                                            (expiryDate.getTime() - today.getTime()) /
                                                (1000 * 60 * 60 * 24),
                                        );

                                        return (
                                            <TableRow key={item.id} data-oid="tboqf-z">
                                                <TableCell
                                                    className="font-medium"
                                                    data-oid="fufr_sc"
                                                >
                                                    {item.name}
                                                </TableCell>
                                                <TableCell data-oid="p2zn87z">
                                                    {item.batchNumber}
                                                </TableCell>
                                                <TableCell data-oid="m9-glag">
                                                    {item.currentStock}
                                                </TableCell>
                                                <TableCell data-oid="y0etwln">
                                                    {item.expiryDate}
                                                </TableCell>
                                                <TableCell data-oid="8pioeht">
                                                    <span
                                                        className={
                                                            daysRemaining <= 7
                                                                ? 'text-red-600 font-semibold'
                                                                : 'text-orange-600'
                                                        }
                                                        data-oid="6140lsy"
                                                    >
                                                        {daysRemaining} days
                                                    </span>
                                                </TableCell>
                                                <TableCell data-oid=".3brd8v">
                                                    <Badge
                                                        variant={
                                                            daysRemaining <= 7
                                                                ? 'destructive'
                                                                : 'secondary'
                                                        }
                                                        data-oid="5st3ym_"
                                                    >
                                                        {daysRemaining <= 7
                                                            ? 'Critical'
                                                            : 'Warning'}
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
            </Tabs>
        </div>
    );
}
