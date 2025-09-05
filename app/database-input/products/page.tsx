'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    masterProductDatabase,
    MasterProduct,
    deleteProduct,
} from '@/lib/database/masterProductDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { filterProducts } from '@/lib/data/products';
export default function ProductsManagementPage() {
    const router = useRouter();
    const [productList, setProductList] = useState<MasterProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<MasterProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        type: '',
        eligibility: '',
    });
    const [sortBy, setSortBy] = useState<'name' | 'category' | 'type' | 'date'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    // Refresh products when the page becomes visible (when navigating back)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadProducts();
            }
        };

        const handleFocus = () => {
            loadProducts();
        };

        // Check for refresh parameter on mount
        const checkRefreshParam = () => {
            if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('refresh')) {
                    loadProducts();
                    // Remove the refresh parameter from URL without triggering a reload
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('refresh');
                    window.history.replaceState({}, '', newUrl.toString());
                }
            }
        };

        checkRefreshParam();

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productList, filters, sortBy, sortOrder]);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            // Create a fresh copy of the database to ensure we get the latest data
            const freshProducts = await filterProducts({});
            setProductList(freshProducts.products);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...productList];

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.nameAr.includes(filters.search) ||
                    p.manufacturer.toLowerCase().includes(searchTerm) ||
                    p.barcode?.includes(searchTerm) ||
                    p.activeIngredient.toLowerCase().includes(searchTerm),
            );
        }

        if (filters.category && filters.category !== '') {
            filtered = filtered.filter((p) => p.category === filters.category);
        }

        if (filters.type && filters.type !== '') {
            filtered = filtered.filter((p) => p.type === filters.type);
        }

        if (filters.eligibility && filters.eligibility !== '') {
            if (filters.eligibility === 'pharmacy-only') {
                filtered = filtered.filter((p) => p.pharmacyEligible && !p.vendorEligible);
            } else if (filters.eligibility === 'vendor-only') {
                filtered = filtered.filter((p) => p.vendorEligible && !p.pharmacyEligible);
            } else if (filters.eligibility === 'both') {
                filtered = filtered.filter((p) => p.pharmacyEligible && p.vendorEligible);
            }
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                case 'date':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        setFilteredProducts(filtered);
    };

    const handleBulkSelect = (productId: number) => {
        setSelectedProducts((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
        );
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map((p) => p.id));
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            type: '',
            eligibility: '',
        });
    };

    const getUniqueValues = (key: keyof MasterProduct) => {
        return Array.from(new Set(productList.map((p) => p[key] as string))).sort();
    };

    // Action handlers for Edit, View, Delete buttons
    const handleEditProduct = (productId: number) => {
        // Navigate to edit page with product ID
        router.push(`/database-input/products/edit/${productId}`);
    };

    const handleViewProduct = (productId: number) => {
        // Navigate to view page with product ID
        router.push(`/database-input/products/view/${productId}`);
    };

    const handleDeleteProduct = (productId: number) => {
        // Show confirmation dialog and delete product
        const product = productList.find((p) => p.id === productId);
        if (
            product &&
            window.confirm(
                `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
            )
        ) {
            // Delete product from the database
            const success = deleteProduct(productId);

            if (success) {
                // Remove product from the local list
                const updatedList = productList.filter((p) => p.id !== productId);
                setProductList(updatedList);

                // Also remove from selected products if it was selected
                setSelectedProducts((prev) => prev.filter((id) => id !== productId));

                // Show success message (you can replace this with a toast notification)
                alert(`Product "${product.name}" has been deleted successfully.`);
            } else {
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    const getEligibilityBadge = (product: MasterProduct) => {
        if (product.pharmacyEligible && product.vendorEligible) {
            return (
                <Badge
                    className="bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20"
                    data-oid="hisadxb"
                >
                    Both
                </Badge>
            );
        } else if (product.pharmacyEligible) {
            return (
                <Badge
                    className="bg-[#14274E]/10 text-[#14274E] border border-[#14274E]/20"
                    data-oid="w.8_93g"
                >
                    Pharmacy Only
                </Badge>
            );
        } else if (product.vendorEligible) {
            return (
                <Badge
                    className="bg-gray-100 text-gray-700 border border-gray-200"
                    data-oid="ht524tg"
                >
                    Vendor Only
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-100 text-gray-600 border border-gray-200" data-oid="ohthv7y">
                None
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const colors = {
            medicine: 'bg-[#14274E]/10 text-[#14274E] border border-[#14274E]/20',
            'medical-supply': 'bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20',
            'hygiene-supply': 'bg-gray-100 text-gray-700 border border-gray-200',
            'medical-device': 'bg-gray-100 text-gray-600 border border-gray-200',
        };
        return (
            <Badge
                className={
                    colors[type as keyof typeof colors] ||
                    'bg-gray-100 text-gray-600 border border-gray-200'
                }
                data-oid="vev4rx."
            >
                {type}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="wi01ayf">
                <div className="text-center" data-oid="riwfayj">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="wcerv.o"
                    ></div>
                    <p className="text-gray-600" data-oid="292i-lr">
                        Loading products...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-oid="hqf0oa3">
                <Card data-oid="yxio58n">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="z0-y6fo"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="t.57inf">
                            Total Products
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                            data-oid="btniw:v"
                        >
                            <svg
                                className="w-5 h-5 text-[#1F1F6F]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="1.fuoy2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    data-oid="wm0hefg"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="60e5.m6">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="8a-lkbg">
                            {productList.length}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="8sfccv3">
                            In master database
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="0ec6jkt">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="msg95qn"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="v8c-8oa">
                            Medicines
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#14274E]/10 rounded-lg flex items-center justify-center"
                            data-oid="y_t49ly"
                        >
                            <svg
                                className="w-5 h-5 text-[#14274E]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="6x.lclc"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    data-oid="rlwr-p_"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="y7mxzyl">
                        <div className="text-2xl font-bold text-[#14274E]" data-oid=".exak7i">
                            {productList.filter((p) => p.type === 'medicine').length}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="lftf:z6">
                            Pharmacy only
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="cllk:8q">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="dmt2m9b"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="6tupu2u">
                            Medical Supplies
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                            data-oid="fb49vju"
                        >
                            <svg
                                className="w-5 h-5 text-[#1F1F6F]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="wdfe_ep"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    data-oid="4i0iga6"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="9p23h2p">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="kfiwv32">
                            {productList.filter((p) => p.type !== 'medicine').length}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="5iq1goe">
                            Both can sell
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="nh_lo.:">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="oqqw_sp"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="ts8p87s">
                            Categories
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#14274E]/10 rounded-lg flex items-center justify-center"
                            data-oid="uee6syv"
                        >
                            <svg
                                className="w-5 h-5 text-[#14274E]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="4h5h8nh"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    data-oid="ekra1b0"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="iqpa1bh">
                        <div className="text-2xl font-bold text-[#14274E]" data-oid="jufm5_t">
                            {new Set(productList.map((p) => p.category)).size}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="6bjb.._">
                            Product categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6" data-oid="dmh--t9">
                <CardHeader data-oid="9et2vbp">
                    <div className="flex items-center justify-between" data-oid="zm56k9d">
                        <CardTitle className="text-gray-800" data-oid="rwpv4sp">
                            Filters & Search
                        </CardTitle>
                        <Button variant="outline" onClick={clearFilters} data-oid="w7rxlan">
                            Clear All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent data-oid="b.sct7m">
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        data-oid="22zbetx"
                    >
                        <div data-oid="_7xokg8">
                            <Label htmlFor="search" data-oid="faz8j6i">
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Name, manufacturer, barcode..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                                }
                                data-oid="ku6l.aj"
                            />
                        </div>
                        <div data-oid="sxwsun7">
                            <Label htmlFor="category" data-oid="jar4biv">
                                Category
                            </Label>
                            <Select
                                value={filters.category}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({ ...prev, category: value }))
                                }
                                data-oid="_f1ji25"
                            >
                                <SelectTrigger data-oid="j10cs.e">
                                    <SelectValue placeholder="All Categories" data-oid="h_75co-" />
                                </SelectTrigger>
                                <SelectContent data-oid="ic-eezc">
                                    {getUniqueValues('category').map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                            data-oid="r9z5b5_"
                                        >
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div data-oid="kydxt_o">
                            <Label htmlFor="type" data-oid="j7pypgu">
                                Type
                            </Label>
                            <Select
                                value={filters.type}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({ ...prev, type: value }))
                                }
                                data-oid="ked..y3"
                            >
                                <SelectTrigger data-oid="-lpg-k2">
                                    <SelectValue placeholder="All Types" data-oid="f9ovc0p" />
                                </SelectTrigger>
                                <SelectContent data-oid="0akagbl">
                                    <SelectItem value="medicine" data-oid="yd8fuc:">
                                        Medicine
                                    </SelectItem>
                                    <SelectItem value="medical-supply" data-oid="l6cm3qh">
                                        Medical Supply
                                    </SelectItem>
                                    <SelectItem value="hygiene-supply" data-oid="_y_yezg">
                                        Hygiene Supply
                                    </SelectItem>
                                    <SelectItem value="medical-device" data-oid="gxqhjbw">
                                        Medical Device
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div data-oid="fi7qqau">
                            <Label htmlFor="eligibility" data-oid="v51:2m.">
                                Eligibility
                            </Label>
                            <Select
                                value={filters.eligibility}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({ ...prev, eligibility: value }))
                                }
                                data-oid="j_w_l:u"
                            >
                                <SelectTrigger data-oid="gl4-yn.">
                                    <SelectValue placeholder="All Eligibility" data-oid="9v2x7mi" />
                                </SelectTrigger>
                                <SelectContent data-oid=":ynryt7">
                                    <SelectItem value="pharmacy-only" data-oid="i-e0_rh">
                                        Pharmacy Only
                                    </SelectItem>
                                    <SelectItem value="vendor-only" data-oid="2l-fsjg">
                                        Vendor Only
                                    </SelectItem>
                                    <SelectItem value="both" data-oid="gt4qano">
                                        Both
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card className="mb-6" data-oid="jzy:lx0">
                <CardContent className="p-4" data-oid="zshud-s">
                    <div className="flex items-center justify-between" data-oid=":4dl1b7">
                        <div className="flex items-center space-x-4" data-oid="av2rfat">
                            <div className="flex items-center space-x-2" data-oid="jfny3fq">
                                <Label data-oid="87o2-:7">Sort by:</Label>
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => setSortBy(value as any)}
                                    data-oid="k9k1fxx"
                                >
                                    <SelectTrigger className="w-32" data-oid="rcyihya">
                                        <SelectValue data-oid="gvqjgbt" />
                                    </SelectTrigger>
                                    <SelectContent data-oid="3ft6wsq">
                                        <SelectItem value="name" data-oid="kp0y-qu">
                                            Name
                                        </SelectItem>
                                        <SelectItem value="category" data-oid="18l6_t:">
                                            Category
                                        </SelectItem>
                                        <SelectItem value="type" data-oid="p7y6192">
                                            Type
                                        </SelectItem>
                                        <SelectItem value="date" data-oid="6vzjg.g">
                                            Date
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                                    }
                                    data-oid="xyjszot"
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </Button>
                            </div>
                            {selectedProducts.length > 0 && (
                                <div className="flex items-center space-x-2" data-oid="r12r3i0">
                                    <span className="text-sm text-gray-600" data-oid="6f4326c">
                                        {selectedProducts.length} selected
                                    </span>
                                    <Button size="sm" variant="outline" data-oid="lobhsdx">
                                        Bulk Edit
                                    </Button>
                                    <Button size="sm" variant="outline" data-oid="xyvrf0s">
                                        Export
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2" data-oid="ap17q5l">
                            <Button variant="outline" onClick={handleSelectAll} data-oid="kqveoof">
                                {selectedProducts.length === filteredProducts.length
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </Button>
                            <Button variant="outline" onClick={loadProducts} data-oid="1x_.l8j">
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="yfyz11:"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        data-oid="_z6:zaw"
                                    />
                                </svg>
                                Refresh
                            </Button>
                            <Button
                                onClick={() => router.push('/database-input/products/add')}
                                className="bg-[#1F1F6F] hover:bg-[#14274E] text-white"
                                data-oid="cq6ga8u"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="6-rusxe"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        data-oid="w630qfb"
                                    />
                                </svg>
                                Add Product
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card data-oid="6rlvq7q">
                <CardHeader data-oid="b5mflz9">
                    <CardTitle className="text-gray-800" data-oid="cvbd4qz">
                        Products ({filteredProducts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent data-oid="7br0tn-">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12" data-oid="tux:w4x">
                            <div
                                className="w-16 h-16 bg-[#1F1F6F]/10 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="ttspbwp"
                            >
                                <svg
                                    className="w-8 h-8 text-[#1F1F6F]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid=":9.e5az"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        data-oid="yb_a0ma"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-2"
                                data-oid="55d2qq9"
                            >
                                No Products Found
                            </h3>
                            <p className="text-gray-600" data-oid="42gmjwf">
                                {productList.length === 0
                                    ? 'No products have been added yet.'
                                    : 'No products match your current filters.'}
                            </p>
                            {productList.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="mt-4"
                                    data-oid="0u_ecbk"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table data-oid="a_ewz:5">
                            <TableHeader data-oid="el02rb.">
                                <TableRow data-oid="nj2yw4a">
                                    <TableHead className="w-12" data-oid="1k79sx_">
                                        <Checkbox
                                            checked={
                                                selectedProducts.length ===
                                                    filteredProducts.length &&
                                                filteredProducts.length > 0
                                            }
                                            onCheckedChange={handleSelectAll}
                                            data-oid="gfvwiup"
                                        />
                                    </TableHead>
                                    <TableHead data-oid="kiyq5.8">Product</TableHead>
                                    <TableHead data-oid="y:q8emw">Category</TableHead>
                                    <TableHead data-oid="rakgso1">Type</TableHead>
                                    <TableHead data-oid="z56c5w3">Eligibility</TableHead>
                                    <TableHead data-oid="xe-xhr8">Prescription</TableHead>
                                    <TableHead data-oid="0iuo14p">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody data-oid="j8t-gy8">
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id} data-oid="kqbk1:_">
                                        <TableCell data-oid="44.jv-i">
                                            <Checkbox
                                                checked={selectedProducts.includes(product.id)}
                                                onCheckedChange={() => handleBulkSelect(product.id)}
                                                data-oid="jai9cem"
                                            />
                                        </TableCell>
                                        <TableCell data-oid="ge8hms0">
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="5r2_9lr"
                                            >
                                                <div
                                                    className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                                    data-oid="3cqio9:"
                                                >
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target =
                                                                    e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                const parent = target.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML = `
                                                                        <div class="w-full h-full bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center">
                                                                            <svg class="w-6 h-6 text-[#1F1F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    `;
                                                                }
                                                            }}
                                                            data-oid="0yqm3wp"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                                                            data-oid="_2fi9aa"
                                                        >
                                                            <svg
                                                                className="w-6 h-6 text-[#1F1F6F]"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="0l2eq53"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    data-oid="gxce6sx"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0" data-oid="xe7g.ta">
                                                    <div
                                                        className="font-medium text-gray-900 truncate"
                                                        data-oid="8j2u-05"
                                                    >
                                                        {product.name}
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-500 truncate"
                                                        data-oid="sas-cxo"
                                                    >
                                                        {product.manufacturer}
                                                    </div>
                                                    {product.barcode && (
                                                        <div
                                                            className="text-xs text-gray-400 truncate"
                                                            data-oid="9rgv12g"
                                                        >
                                                            {product.barcode}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="181jil1">
                                            <Badge
                                                className="bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20"
                                                data-oid="6_pnn_g"
                                            >
                                                {product.category.charAt(0).toUpperCase() +
                                                    product.category.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell data-oid="n-0.gp_">
                                            {getTypeBadge(product.type)}
                                        </TableCell>
                                        <TableCell data-oid=":wn_plm">
                                            {getEligibilityBadge(product)}
                                        </TableCell>
                                        <TableCell data-oid="ndcg6rt">
                                            {product.prescriptionRequired ? (
                                                <Badge
                                                    className="bg-[#14274E]/10 text-[#14274E] border border-[#14274E]/20"
                                                    data-oid="qq-tj0_"
                                                >
                                                    Required
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    className="bg-gray-100 text-gray-600 border border-gray-200"
                                                    data-oid="ouvu:jp"
                                                >
                                                    Not Required
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell data-oid="rh52evs">
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="14ovgi5"
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditProduct(product._id)}
                                                    className="hover:bg-[#1F1F6F]/10 hover:text-[#1F1F6F] hover:border-[#1F1F6F]/20"
                                                    data-oid="dqgl_oh"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="6:-qrrh"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            data-oid="oni5mm8"
                                                        />
                                                    </svg>
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewProduct(product._id)}
                                                    className="hover:bg-[#14274E]/10 hover:text-[#14274E] hover:border-[#14274E]/20"
                                                    data-oid="dap81xk"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="cjv6zy_"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            data-oid="hl3bj:0"
                                                        />

                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            data-oid="c10t9zz"
                                                        />
                                                    </svg>
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 hover:border-red-200"
                                                    data-oid="vpi.kgi"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="erayauy"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            data-oid="8_vgpuz"
                                                        />
                                                    </svg>
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
