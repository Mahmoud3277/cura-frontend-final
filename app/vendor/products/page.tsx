'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { VendorProductSelectionModal } from '@/components/vendor/VendorProductSelectionModal';
import { ProductWithInventory } from '@/lib/services/roleBasedAccessService';
import { providerOrderService } from '@/lib/services/vendorManagementService';
import { ChevronDown, Pencil, Trash, Eye } from 'lucide-react';

interface Product {
    _id?: string;
    id?: number;
    productId?: {
        _id: string;
        Productname: string;
        nameAr?: string;
        category: string;
        Manufacturer: string;
        description?: string;
        images?: Array<{
            _id: string;
            filename: string;
            key: string;
            originalName: string;
            size: number;
            type: string;
            uploadedAt: string;
            url: string;
        }>;
    };
    productName?: string;
    name?: string;
    nameAr?: string;
    category?: string;
    manufacturer?: string;
    description?: string;
    activeIngredient?: string;
    dosage?: string;
    form?: string;
    prescriptionRequired?: boolean;
    price: number;
    pricePerBlister?: number;
    pricePerBox?: number;
    stock?: number;
    stockQuantity?: number;
    expiryDate?: string;
    batchNumber?: string;
    location?: string;
    minStockThreshold?: number;
    supplier?: string;
    notes?: string;
    isInInventory?: boolean;
    sku?: string;
    image?: string;
    discount?: {
        type: 'percentage' | 'fixed';
        value: number;
        startDate?: string;
        endDate?: string;
        isActive: boolean;
    };
}

export default function VendorProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSupplier, setSelectedSupplier] = useState('all');
    const [selectedStockLevel, setSelectedStockLevel] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(true);
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showDropdown, setShowDropdown] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [suppliers, setSuppliers] = useState<string[]>(['all']);
    const [addedProduct, setAddedProduct] = useState<Product | null>(null);

    const categories = [
        'all',
        'hygiene',
        'medical-supplies',
        'medical-devices',
        'wound-care',
        'emergency-care',
        'personal-care',
        'sanitization',
        'diagnostic-tools',
        'safety-equipment',
    ];

    const stockLevels = ['all', 'high', 'medium', 'low', 'out'];

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [
        products,
        searchQuery,
        selectedCategory,
        selectedSupplier,
        selectedStockLevel,
        sortBy,
        sortOrder,
    ]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showDropdown !== null) {
                const target = event.target as HTMLElement;
                if (!target.closest('.relative')) {
                    setShowDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const getUser = async (): Promise<string> => {
        const token = Cookies.get('authToken');
        const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        const data = await user.json();
        return data.data.vendor._id;
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const vendorId = await getUser();
            const response = await providerOrderService.getVendorById(vendorId);
            console.log(response, 'response from apge')
            if (response && response.data.products) {
                const inventoryProducts = response.data.products;
                console.log('products', inventoryProducts)
                setProducts(inventoryProducts);
                const uniqueSuppliers = ['all', ...new Set(
                    inventoryProducts.map((item: Product) =>
                        item.productId?.Manufacturer || item.manufacturer || 'Unknown'
                    )
                )];
                setSuppliers(uniqueSuppliers);
            }
        } catch (error) {
            console.error('Error loading vendor products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered: Product[] = [...products];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    (product.productName || product.name || product.productId?.Productname || '').toLowerCase().includes(query) ||
                    (product.nameAr || product.productId?.nameAr || '').includes(searchQuery) ||
                    (product.activeIngredient || '').toLowerCase().includes(query) ||
                    (product.manufacturer || product.productId?.Manufacturer || '').toLowerCase().includes(query) ||
                    (product.batchNumber || '').toLowerCase().includes(query) ||
                    (product.sku || '').toLowerCase().includes(query),
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((product) =>
                (product.category || product.productId?.category) === selectedCategory
            );
        }

        if (selectedSupplier !== 'all') {
            filtered = filtered.filter((product) =>
                (product.manufacturer || product.productId?.Manufacturer) === selectedSupplier
            );
        }

        if (selectedStockLevel !== 'all') {
            filtered = filtered.filter((product) => {
                const stockStatus = getStockStatus(product);
                return stockStatus === selectedStockLevel;
            });
        }

        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortBy === 'name') {
                aValue = a.productName || a.name || a.productId?.Productname || '';
                bValue = b.productName || b.name || b.productId?.Productname || '';
            } else if (sortBy === 'stock') {
                aValue = a.stock || a.stockQuantity || 0;
                bValue = b.stock || b.stockQuantity || 0;
            } else {
                aValue = (a as any)[sortBy];
                bValue = (b as any)[sortBy];
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredProducts(filtered);
    };

    const getStockStatus = (product: Product): string => {
        const stock = product.stock || product.stockQuantity || 0;
        const minThreshold = product.minStockThreshold || 10;
        if (!stock || stock === 0) return 'out';
        if (stock <= minThreshold) return 'low';
        if (stock <= minThreshold * 2) return 'medium';
        return 'high';
    };

    const getStockBadgeColor = (status: string) => {
        switch (status) {
            case 'high':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'low':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            case 'out':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const getProductImage = (product: Product): string => {
        // Check if productId has images array
        if (product.productId?.images && Array.isArray(product.productId.images) && product.productId.images.length > 0) {
            return product.productId.images[0].url;
        }
        
        // Fallback to legacy image field
        if (product.image) {
            return product.image;
        }
        
        // Default placeholder
        return '/api/placeholder/300/300';
    };

    const calculateDiscountedPrice = (product: Product): number => {
        if (!product.discount || !product.discount.isActive) {
            return product.price;
        }

        const now = new Date();
        if (product.discount.startDate && new Date(product.discount.startDate) > now) {
            return product.price;
        }
        if (product.discount.endDate && new Date(product.discount.endDate) < now) {
            return product.price;
        }

        if (product.discount.type === 'percentage') {
            return product.price * (1 - product.discount.value / 100);
        } else {
            return Math.max(0, product.price - product.discount.value);
        }
    };

    const getDiscountBadge = (product: Product) => {
        if (!product.discount || !product.discount.isActive) return null;

        const now = new Date();
        if (product.discount.startDate && new Date(product.discount.startDate) > now) return null;
        if (product.discount.endDate && new Date(product.discount.endDate) < now) return null;

        const discountText =
            product.discount.type === 'percentage'
                ? `${product.discount.value}% OFF`
                : `EGP ${product.discount.value} OFF`;

        return (
            <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
            >
                {discountText}
            </Badge>
        );
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct({ ...product }); // Create a copy to avoid reference issues
        setShowEditModal(true);
    };

    const handleAddProduct = () => {
        setShowProductSelectionModal(true);
    };

    const handleProductSelection = (selectedProduct: ProductWithInventory, inventoryData: any) => {
        loadProducts();
        setShowProductSelectionModal(false);
    };

    const handleUpdateProduct = async (productId: string, updateData: Product) => {
        try {
            const vendorId = await getUser();
            const token = Cookies.get('authToken');
            console.log(productId, 'productId to edit.')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/vendors/update-products/${vendorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    updates: [{ productId, updates: updateData }]
                })
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.data.inventory);
                setEditingProduct(null);
                setShowEditModal(false);
            } else {
                console.error('Update failed:', data.error);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            const vendorId = await getUser();
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/vendors/delete-products/${vendorId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productIds: [id]
                })
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.data.inventory);
                setShowDeleteConfirm(null);
            } else {
                console.error('Delete failed:', data.error);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleDropdownToggle = (productId: string) => {
        setShowDropdown(showDropdown === productId ? null : productId);
    };

    const confirmDeleteProduct = () => {
        if (showDeleteConfirm) {
            handleDeleteProduct(showDeleteConfirm);
        }
    };

    const cancelDeleteProduct = () => {
        setShowDeleteConfirm(null);
    };

    const handleViewDetails = (product: Product) => {
        setViewingProduct(product);
        setShowViewDetailsModal(true);
        setShowDropdown(null);
    };

    const handleCloseModal = () => {
        setShowViewDetailsModal(false);
        setViewingProduct(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1F1F6F] mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading product inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-full overflow-hidden">
            {/* Header with Add Product Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
                    <p className="text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <Button
                    className="bg-cura-primary hover:bg-cura-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleAddProduct}
                    type="button"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </Button>
            </div>

            {/* Enhanced Stats Cards with CURA Branding */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 rounded-lg shadow-sm border border-cura-primary/20 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-cura-gradient rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm text-cura-primary font-medium">Total Products</div>
                            <div className="text-2xl font-bold text-cura-primary">{products && products.length}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm text-yellow-700 font-medium">Low Stock Items</div>
                            <div className="text-2xl font-bold text-yellow-700">
                                {products && products.filter((p) => getStockStatus(p) === 'low').length}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4M4 12l4-4m-4 4l4 4" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm text-red-700 font-medium">Out of Stock</div>
                            <div className="text-2xl font-bold text-red-700">
                                {products && products.filter((p) => getStockStatus(p) === 'out').length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Filters and Search with CURA Branding */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                        <Input
                            placeholder="Search products, SKU, batch numbers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border-gray-300 focus:border-cura-primary"
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category === 'all'
                                        ? 'All Categories'
                                        : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                        <SelectTrigger>
                            <SelectValue placeholder="Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map((supplier) => (
                                <SelectItem key={supplier} value={supplier}>
                                    {supplier === 'all' ? 'All Suppliers' : supplier}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedStockLevel} onValueChange={setSelectedStockLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Stock Level" />
                        </SelectTrigger>
                        <SelectContent>
                            {stockLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level === 'all'
                                        ? 'All Stock Levels'
                                        : level.charAt(0).toUpperCase() + level.slice(1) + ' Stock'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Enhanced Inventory Table with CURA Branding */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
                            <p className="text-sm text-gray-600">{filteredProducts.length} items in your inventory</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                {filteredProducts.filter((p) => getStockStatus(p) === 'high').length} High Stock
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                {filteredProducts.filter((p) => getStockStatus(p) === 'medium').length} Medium Stock
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                                {filteredProducts.filter((p) => getStockStatus(p) === 'low').length} Low Stock
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                                {filteredProducts.filter((p) => getStockStatus(p) === 'out').length} Out of Stock
                            </Badge>
                        </div>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-16">
                                <div className="w-8 h-8 bg-gradient-to-br from-cura-primary/20 to-cura-primary/30 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-cura-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                                <div className="flex items-center space-x-1">
                                    <span className="font-semibold">Product</span>
                                    {sortBy === 'name' && (
                                        <span className="text-cura-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('stock')}>
                                <div className="flex items-center space-x-1">
                                    <span className="font-semibold">Stock</span>
                                    {sortBy === 'stock' && (
                                        <span className="text-cura-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('price')}>
                                <div className="flex items-center space-x-1">
                                    <span className="font-semibold">Box Price</span>
                                    {sortBy === 'price' && (
                                        <span className="text-cura-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead>Blister Price</TableHead>
                            <TableHead>Expiry</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product);
                            const productId = product._id || product.id?.toString() || '';
                            return (
                                <TableRow key={productId} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.productName || product.name || product.productId?.Productname || ''}
                                                className="w-12 h-12 rounded-lg object-cover border-2 border-cura-primary/20 shadow-sm"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                            <div className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-primary/20 rounded-lg flex items-center justify-center border-2 border-cura-primary/20 hidden">
                                                <svg className="w-6 h-6 text-cura-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {product.productName || product.name || product.productId?.Productname}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.nameAr || product.productId?.nameAr}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {product.activeIngredient} • {product.dosage} • {product.form}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {product.sku}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-cura-primary/5 text-cura-primary">
                                            {(product.category || product.productId?.category || '').replace('-', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">
                                                {product.stock || product.stockQuantity || 0}
                                            </span>
                                            <Badge variant="outline" className={getStockBadgeColor(stockStatus)}>
                                                {stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1)}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            {product.discount && product.discount.isActive ? (
                                                <>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        EGP {(product.pricePerBox || product.price)?.toFixed(2)}
                                                    </span>
                                                    <span className="font-medium text-green-600">
                                                        EGP {calculateDiscountedPrice(product).toFixed(2)}
                                                    </span>
                                                    {getDiscountBadge(product)}
                                                </>
                                            ) : (
                                                <span className="font-medium text-green-600">
                                                    EGP {(product.pricePerBox || product.price)?.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-blue-600">
                                            {product.pricePerBlister ? `EGP ${product.pricePerBlister.toFixed(2)}` : 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {product.expiryDate && new Date(product.expiryDate).toLocaleDateString()}
                                        </div>
                                        {product.batchNumber && (
                                            <div className="text-xs text-gray-500">
                                                Batch: {product.batchNumber}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2 relative">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                Edit
                                            </Button>
                                            <div className="relative">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={() => handleDropdownToggle(productId)}
                                                >
                                                    •••
                                                </Button>
                                                {showDropdown === productId && (
                                                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleViewDetails(product)}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                View Details
                                                            </button>
                                                            <div className="border-t border-gray-100 my-1"></div>
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(productId)}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                Delete Product
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4 flex justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedSupplier('all');
                                setSelectedStockLevel('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Product Selection Modal */}
            <VendorProductSelectionModal
                isOpen={showProductSelectionModal}
                setAddedProduct={setAddedProduct}
                onClose={() => setShowProductSelectionModal(false)}
                onSelectProduct={handleProductSelection}
                
                vendorId="vendor-default" // This should be dynamic based on logged-in vendor

            />

            {/* View Details Modal */}
            {showViewDetailsModal && viewingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowViewDetailsModal(false)}
                                >
                                    ×
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <div className="font-medium text-gray-900">
                                            {viewingProduct.productName || viewingProduct.name || viewingProduct.productId?.Productname}
                                        </div>
                                        {(viewingProduct.nameAr || viewingProduct.productId?.nameAr) && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                {viewingProduct.nameAr || viewingProduct.productId?.nameAr}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <code className="text-sm font-mono">{viewingProduct.sku}</code>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <Badge variant="outline" className="bg-cura-primary/5 text-cura-primary">
                                            {(viewingProduct.category || viewingProduct.productId?.category || '').replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">
                                                {viewingProduct.stock || viewingProduct.stockQuantity || 0}
                                            </span>
                                            <Badge variant="outline" className={getStockBadgeColor(getStockStatus(viewingProduct))}>
                                                {getStockStatus(viewingProduct).charAt(0).toUpperCase() + getStockStatus(viewingProduct).slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Box Price</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <span className="font-medium text-green-600">
                                            EGP {(viewingProduct.pricePerBox || viewingProduct.price)?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Blister Price</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <span className="font-medium text-blue-600">
                                            {viewingProduct.pricePerBlister ? `EGP ${viewingProduct.pricePerBlister.toFixed(2)}` : 'Not specified'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        {viewingProduct.expiryDate
                                            ? new Date(viewingProduct.expiryDate).toLocaleDateString()
                                            : 'Not specified'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        {viewingProduct.batchNumber || 'Not specified'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        {viewingProduct.manufacturer || viewingProduct.productId?.Manufacturer || 'Not specified'}
                                    </div>
                                </div>
                            </div>

                            {viewingProduct.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        {viewingProduct.description || viewingProduct.productId?.description}
                                    </div>
                                </div>
                            )}

                            {viewingProduct.minStockThreshold && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Threshold</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        {viewingProduct.minStockThreshold} units
                                    </div>
                                </div>
                            )}

                            {viewingProduct.notes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        {viewingProduct.notes}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <div className="flex space-x-3">
                                <Button
                                    className="flex-1 bg-cura-primary hover:bg-cura-primary/90"
                                    onClick={() => {
                                        setShowViewDetailsModal(false);
                                        handleEditProduct(viewingProduct);
                                    }}
                                >
                                    Edit Product
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowViewDetailsModal(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    ×
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Box Price (EGP) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.pricePerBox || editingProduct.price || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setEditingProduct({
                                                ...editingProduct,
                                                pricePerBox: value ? parseFloat(value) : undefined,
                                                price: value ? parseFloat(value) : undefined,
                                            });
                                        }}
                                        placeholder="Enter box price"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Blister Price (EGP)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.pricePerBlister || ''}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                pricePerBlister: e.target.value ? parseFloat(e.target.value) : undefined,
                                            })
                                        }
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Quantity *
                                    </label>
                                    <Input
                                        type="number"
                                        value={editingProduct.stock || editingProduct.stockQuantity || 0}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                stock: parseInt(e.target.value),
                                                stockQuantity: parseInt(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={editingProduct.expiryDate || ''}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                expiryDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Batch Number
                                    </label>
                                    <Input
                                        value={editingProduct.batchNumber || ''}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                batchNumber: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Discount Section */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Discount Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Type
                                        </label>
                                        <Select
                                            value={editingProduct.discount?.type || 'percentage'}
                                            onValueChange={(value: 'percentage' | 'fixed') =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    discount: {
                                                        ...editingProduct.discount,
                                                        type: value,
                                                        value: editingProduct.discount?.value || 0,
                                                        isActive: editingProduct.discount?.isActive || false,
                                                    },
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount (EGP)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Value
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max={editingProduct.discount?.type === 'percentage' ? 100 : undefined}
                                            value={editingProduct.discount?.value || 0}
                                            onChange={(e) =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    discount: {
                                                        ...editingProduct.discount,
                                                        type: editingProduct.discount?.type || 'percentage',
                                                        value: parseFloat(e.target.value) || 0,
                                                        isActive: editingProduct.discount?.isActive || false,
                                                    },
                                                })
                                            }
                                            placeholder={editingProduct.discount?.type === 'percentage' ? '0-100' : '0.00'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date (Optional)
                                        </label>
                                        <Input
                                            type="date"
                                            value={editingProduct.discount?.startDate || ''}
                                            onChange={(e) =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    discount: {
                                                        ...editingProduct.discount,
                                                        type: editingProduct.discount?.type || 'percentage',
                                                        value: editingProduct.discount?.value || 0,
                                                        startDate: e.target.value,
                                                        isActive: editingProduct.discount?.isActive || false,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date (Optional)
                                        </label>
                                        <Input
                                            type="date"
                                            value={editingProduct.discount?.endDate || ''}
                                            onChange={(e) =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    discount: {
                                                        ...editingProduct.discount,
                                                        type: editingProduct.discount?.type || 'percentage',
                                                        value: editingProduct.discount?.value || 0,
                                                        endDate: e.target.value,
                                                        isActive: editingProduct.discount?.isActive || false,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-4">
                                    <input
                                        type="checkbox"
                                        id="discountActive"
                                        checked={editingProduct.discount?.isActive || false}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                discount: {
                                                    ...editingProduct.discount,
                                                    type: editingProduct.discount?.type || 'percentage',
                                                    value: editingProduct.discount?.value || 0,
                                                    isActive: e.target.checked,
                                                },
                                            })
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="discountActive" className="text-sm text-gray-700">
                                        Enable Discount
                                    </label>
                                </div>
                                {editingProduct.discount?.isActive && editingProduct.discount?.value > 0 && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-green-800">
                                                Discounted Price Preview:
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500 line-through">
                                                    EGP {editingProduct.price?.toFixed(2)}
                                                </span>
                                                <span className="text-lg font-bold text-green-600">
                                                    EGP {calculateDiscountedPrice(editingProduct).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <div className="flex space-x-3">
                                <Button
                                    className="flex-1 bg-cura-primary hover:bg-cura-primary/90"
                                    onClick={() => handleUpdateProduct(editingProduct._id || editingProduct.id?.toString() || '', editingProduct)}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Delete Product</h2>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete this product from your inventory?
                                This will permanently remove all product information and cannot be undone.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700 text-sm font-medium">
                                        Warning: This action is permanent and cannot be reversed
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={cancelDeleteProduct}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={()=>{handleDeleteProduct(showDeleteConfirm)}}
                                >
                                    Delete Product
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}