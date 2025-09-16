'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { ProductSelectionModal } from '@/components/pharmacy/ProductSelectionModal';
import { ProductAddedNotification } from '@/components/pharmacy/ProductAddedNotification';
import { Logo } from '@/components/ui/Logo';
import { products as productData, Product as BaseProduct, filterProducts } from '@/lib/data/products';
import { extendedMedicineData, ExtendedMedicine } from '@/lib/data/medicineData';
import { providerOrderService } from '@/lib/services/pharmacyOrderService';
import pharmacyManagementService from '@/lib/services/pharmacyManagementService';

interface Product extends BaseProduct {
    stock?: number;
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

export default function PharmacyProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSupplier, setSelectedSupplier] = useState('all');
    const [selectedStockLevel, setSelectedStockLevel] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(true);
    const [AddedProduct, setAddedProduct] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [addedProductName, setAddedProductName] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        nameAr: '',
        category: 'otc',
        activeIngredient: '',
        dosage: '',
        form: 'Tablet',
        prescriptionRequired: false,
        price: '',
        stock: '',
        expiryDate: '',
        batchNumber: '',
        sku: '',
    });

    const categories = [
        'all',
        'antibiotics',
        'pain-relief',
        'cardiovascular',
        'diabetes',
        'respiratory',
        'digestive',
        'vitamins',
        'skincare',
        'otc',
        'supplements',
        'baby-care',
        'women-health',
        'men-health',
    ];

    

    const stockLevels = ['all', 'high', 'medium', 'low', 'out'];

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        filterAndSortProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        products,
        searchQuery,
        selectedCategory,
        selectedSupplier,
        selectedStockLevel,
        sortBy,
        sortOrder,
    ]);
    const handleUpdateProduct = async (productId, updateData) => {
        try {
            console.log(productId, updateData)
          const pharmacyId = await getUser();
          const token = Cookies.get('authToken');
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pharmacies/update-products/${pharmacyId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                updates:[updateData]
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log(data, 'after update')
            setProducts(data.data.inventory);
            setEditingProduct(null);
            setShowEditModal(true);
            console.log('Product updated successfully');
          } else {
            console.log(data.error);
          }
        } catch (error) {
          console.log(error);
        }
      };
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
    const [suppliers, setsuppliers] = useState([]);
    const getUser = async():Promise<string>=>{
        const token = Cookies.get('authToken')
        const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,{
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
        const data = await user.json()
        console.log(data)
        return data.data.pharmacy.id;
    }
    const loadProducts = async () => {
        try {
            // const allProducts = await filterProducts({})
            const id = await getUser()
            const inventoryProducts = await pharmacyManagementService.getPharmacyById(id)
            if(inventoryProducts){
                console.log(inventoryProducts.inventory, 'inven')
                setProducts(inventoryProducts.inventory)
                inventoryProducts.inventory.map((supplier)=>{
                    if (supplier.productId?.Manufacturer) {
                        setsuppliers((e)=>[...e, supplier.productId.Manufacturer])
                    }
                })
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading products:', error);
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered = []
        if(products){
            console.log(products, 'filtering products')
            filtered = [...products];
        }
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.Productname.toLowerCase().includes(query) ||
                    product.nameAr.includes(searchQuery) ||
                    product.activeIngredient.toLowerCase().includes(query) ||
                    product.manufacturer.toLowerCase().includes(query) ||
                    product.batchNumber?.toLowerCase().includes(query) ||
                    product.sku?.toLowerCase().includes(query),
            );
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((product) => product.productId.category === selectedCategory);
        }

        // Apply supplier filter
        if (selectedSupplier !== 'all') {
            filtered = filtered.filter((product) => product.productId.Manufacturer === selectedSupplier);
        }

        // Apply stock level filter
        if (selectedStockLevel !== 'all') {
            filtered = filtered.filter((product) => {
                const stockStatus = getStockStatus(product);
                return stockStatus === selectedStockLevel;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any = a[sortBy as keyof Product];
            let bValue: any = b[sortBy as keyof Product];

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
        console.log(filtered, 'array')
        setFilteredProducts(filtered);
    };

    const getStockStatus = (product: Product): string => {
        if (!product.stockQuantity || product.stock === 0) return 'out';
        if (product.stockQuantity <= (product.minStockThreshold || 10)) return 'low';
        if (product.stockQuantity <= (product.minStockThreshold || 10) * 2) return 'medium';
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

    const calculateDiscountedPrice = (product: Product): number => {
        if (!product.discount || !product.discount.isActive) {
            return product.price;
        }

        // Check if discount is within date range
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
                data-oid="5dc25k:"
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
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleAddProduct = () => {
        setShowProductSelectionModal(true);
    };
    useEffect(() => {
        console.log(viewingProduct, 'v')
    }, [viewingProduct]);
    const handleProductSelection = (
        selectedProduct: BaseProduct | ExtendedMedicine,
        inventoryData: any,
    ) => {
        // Convert selected product to our local product format
        const newProduct: Product = {
            id: Date.now(),
            name: selectedProduct.Productname,
            nameAr: selectedProduct.productId.nameAr || '',
            category: selectedProduct.category,
            manufacturer: selectedProduct.manufacturer,
            description: selectedProduct.description || '',
            activeIngredient: selectedProduct.activeIngredient || '',
            dosage: 'dosage' in selectedProduct ? selectedProduct.dosage : '',
            form: 'form' in selectedProduct ? selectedProduct.form : 'Tablet',
            prescriptionRequired:
                'requiresPrescription' in selectedProduct
                    ? selectedProduct.requiresPrescription
                    : false,
            price: inventoryData.price,
            stock: inventoryData.stock,
            expiryDate: inventoryData.expiryDate,
            batchNumber: inventoryData.batchNumber,
            minStockThreshold: inventoryData.minStockThreshold,
            supplier: selectedProduct.manufacturer, // Use manufacturer as supplier
            location: '', // Default empty location
            notes: '', // Default empty notes
            isInInventory: true,
            sku: `MED-${selectedProduct.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
        };

        setProducts([...products, newProduct]);
        setShowProductSelectionModal(false);
        setAddedProductName(selectedProduct.name);
        setShowNotification(true);
    };

    const handleSaveNewProduct = () => {
        const product: Product = {
            id: Date.now(),
            name: newProduct.name,
            nameAr: newProduct.nameAr,
            category: newProduct.category,
            manufacturer: 'Unknown',
            description: `${newProduct.activeIngredient} ${newProduct.dosage}`,
            activeIngredient: newProduct.activeIngredient,
            dosage: newProduct.dosage,
            form: newProduct.form,
            prescriptionRequired: newProduct.prescriptionRequired,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            expiryDate: newProduct.expiryDate,
            batchNumber: newProduct.batchNumber,
            isInInventory: true,
            sku: newProduct.sku,
        };

        setProducts([...products, product]);
        setShowAddModal(false);
        resetNewProductForm();
    };

    const handleSaveEditProduct = () => {
        if (!editingProduct) return;

        const updatedProducts = products.map((p) =>
            p.id === editingProduct.id ? editingProduct : p,
        );
        setProducts(updatedProducts);
        setShowEditModal(false);
        setEditingProduct(null);
    };

    const resetNewProductForm = () => {
        setNewProduct({
            name: '',
            nameAr: '',
            category: 'otc',
            activeIngredient: '',
            dosage: '',
            form: 'Tablet',
            prescriptionRequired: false,
            price: '',
            stock: '',
            expiryDate: '',
            batchNumber: '',
            sku: '',
        });
    };
    const handleDeleteProduct = async(id)=>{
        try {

            const pharmacyId = await getUser()
            const token = Cookies.get('authToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pharmacies/delete-products/${pharmacyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productIds:[id]
                })
            });
            const data = await response.json()
            if(data.success){
                setProducts(data.data.inventory)
                console.log('product deleted')
            }
            else{
                console.log(data.error)
            }
        
        } catch (error) {
            console.log(error)
        }
    }
    const handleDropdownToggle = (productId: number) => {
        setShowDropdown(showDropdown === productId ? null : productId);
    };

     

    const confirmDeleteProduct = () => {
        if (showDeleteConfirm) {
            setProducts(products.filter((p) => p.id !== showDeleteConfirm));
            setShowDeleteConfirm(null);
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
    useEffect(() => {
        if(AddedProduct.length > 0){
            setProducts(AddedProduct)
        }
    }, [AddedProduct]);
    if (loading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="nyy_nfu"
            >
                <div className="text-center" data-oid="iwhhju1">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"
                        data-oid="4u-a2e:"
                    ></div>
                    <p className="text-gray-600 text-lg" data-oid="km81uyw">
                        Loading inventory...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="ds:7z4d">
            <div className="max-w-7xl mx-auto p-6" data-oid="cg7.9id">
                {/* Header with Add Product Button */}
                <div className="flex items-center justify-between mb-6" data-oid="rz24me_">
                    <div data-oid="9brukj0">
                        <h1 className="text-2xl font-bold text-gray-900" data-oid="fvq9h13">
                            Product Inventory
                        </h1>
                        <p className="text-gray-600" data-oid="hvkmiuq">
                            Manage your product inventory
                        </p>
                    </div>
                    <Button
                        className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handleAddProduct}
                        data-oid="6ig1ow9"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="mafzg26"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                                data-oid="8rs1i00"
                            />
                        </svg>
                        Add Product
                    </Button>
                </div>

                {/* Enhanced Stats Cards with CURA Branding */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-oid="fwygq2v">
                    <div
                        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-sm border border-slate-300 p-4 hover:shadow-md transition-shadow"
                        data-oid="nzybiuq"
                    >
                        <div className="flex items-center space-x-3" data-oid=".o50:u3">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg"
                                data-oid="7ef02l:"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="8hzboqo"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        data-oid="g7raequ"
                                    />
                                </svg>
                            </div>
                            <div data-oid="1c5-47m">
                                <div
                                    className="text-sm text-slate-600 font-medium"
                                    data-oid="f_fov89"
                                >
                                    Total Products
                                </div>
                                <div
                                    className="text-2xl font-bold text-slate-800"
                                    data-oid="abko9_n"
                                >
                                    {products && products.length}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-sm border border-slate-300 p-4 hover:shadow-md transition-shadow"
                        data-oid="e1gel.x"
                    >
                        <div className="flex items-center space-x-3" data-oid="s-ovbu5">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg"
                                data-oid="o6-u-9g"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="7r.n_dh"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        data-oid="x_e8f9u"
                                    />
                                </svg>
                            </div>
                            <div data-oid="lr7owdd">
                                <div
                                    className="text-sm text-slate-600 font-medium"
                                    data-oid=":wmuz37"
                                >
                                    Low Stock Items
                                </div>
                                <div
                                    className="text-2xl font-bold text-slate-800"
                                    data-oid="drvien9"
                                >
                                    {products  && products.filter((p) => getStockStatus(p) === 'low').length}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-sm border border-slate-300 p-4 hover:shadow-md transition-shadow"
                        data-oid="7d_bk3j"
                    >
                        <div className="flex items-center space-x-3" data-oid="w7.cc5v">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg flex items-center justify-center shadow-lg"
                                data-oid="b3mjxtg"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="8kdv8:7"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4m16 0l-4-4m4 4l-4 4M4 12l4-4m-4 4l4 4"
                                        data-oid="erpkt9w"
                                    />
                                </svg>
                            </div>
                            <div data-oid="rat.42:">
                                <div
                                    className="text-sm text-slate-600 font-medium"
                                    data-oid="6qw0j:z"
                                >
                                    Out of Stock
                                </div>
                                <div
                                    className="text-2xl font-bold text-slate-800"
                                    data-oid="54klpqe"
                                >
                                    {products && products.filter((p) => getStockStatus(p) === 'out').length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters and Search with CURA Branding */}
                <div
                    className="bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                    data-oid="avzle6s"
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                        data-oid="rqkzkd:"
                    >
                        <div className="lg:col-span-2" data-oid="_uiywec">
                            <Input
                                placeholder="Search products, SKU, batch numbers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border-gray-300 focus:border-blue-500"
                                data-oid="fpabffz"
                            />
                        </div>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                            data-oid="itcjbj9"
                        >
                            <SelectTrigger data-oid="-1a7e9e">
                                <SelectValue placeholder="Category" data-oid="6-gewh3" />
                            </SelectTrigger>
                            <SelectContent data-oid="p2h332:">
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category} data-oid="p0.aa9x">
                                        {category === 'all'
                                            ? 'All Categories'
                                            : category.charAt(0).toUpperCase() +
                                              category.slice(1).replace('-', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedSupplier}
                            onValueChange={setSelectedSupplier}
                            data-oid="3v1plk:"
                        >
                            <SelectTrigger data-oid="axgtvoo">
                                <SelectValue placeholder="Supplier" data-oid="o1lwsq5" />
                            </SelectTrigger>
                            <SelectContent data-oid="tn461:i">
                                {suppliers.map((supplier) => (
                                    <SelectItem key={supplier} value={supplier} data-oid="luknkbv">
                                        {supplier === 'all' ? 'All Suppliers' : supplier}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedStockLevel}
                            onValueChange={setSelectedStockLevel}
                            data-oid="xb8ook0"
                        >
                            <SelectTrigger data-oid="2-7hhcq">
                                <SelectValue placeholder="Stock Level" data-oid="frw-gyp" />
                            </SelectTrigger>
                            <SelectContent data-oid="h0.a4o0">
                                {stockLevels.map((level) => (
                                    <SelectItem key={level} value={level} data-oid="jxq2lde">
                                        {level === 'all'
                                            ? 'All Stock Levels'
                                            : level.charAt(0).toUpperCase() +
                                              level.slice(1) +
                                              ' Stock'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Enhanced Inventory Table with CURA Branding */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    data-oid="py.9ebj"
                >
                    <div
                        className="px-6 py-4 border-b border-gray-200 bg-gray-50"
                        data-oid="z90crlu"
                    >
                        <div className="flex items-center justify-between" data-oid="8vfoo-a">
                            <div data-oid="g68vjok">
                                <h2
                                    className="text-lg font-semibold text-gray-900"
                                    data-oid="rlxh_e:"
                                >
                                    Inventory Management
                                </h2>
                                <p className="text-sm text-gray-600" data-oid="caut0cr">
                                    {filteredProducts.length} items in your inventory
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="kp547l8">
                                <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700"
                                    data-oid="-c_8vjp"
                                >
                                    {
                                        filteredProducts.filter((p) => getStockStatus(p) === 'high')
                                            .length
                                    }{' '}
                                    High Stock
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700"
                                    data-oid="31cdtmu"
                                >
                                    {
                                        filteredProducts.filter(
                                            (p) => getStockStatus(p) === 'medium',
                                        ).length
                                    }{' '}
                                    Medium Stock
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700"
                                    data-oid="jjcu00o"
                                >
                                    {
                                        filteredProducts.filter((p) => getStockStatus(p) === 'low')
                                            .length
                                    }{' '}
                                    Low Stock
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700"
                                    data-oid="bdhhx-y"
                                >
                                    {
                                        filteredProducts.filter((p) => getStockStatus(p) === 'out')
                                            .length
                                    }{' '}
                                    Out of Stock
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Table data-oid="8c3vxeg">
                        <TableHeader data-oid="t:tz0ts">
                            <TableRow className="bg-gray-50" data-oid="0gjt35g">
                                <TableHead className="w-16" data-oid="k4x5bpr">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center"
                                        data-oid="l9vj9mh"
                                    >
                                        <svg
                                            className="w-4 h-4 text-slate-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="o:7k8l."
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                data-oid="lxeisgz"
                                            />
                                        </svg>
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('name')}
                                    data-oid="q7r8cx6"
                                >
                                    <div className="flex items-center space-x-1" data-oid="j94i5hl">
                                        <span className="font-semibold" data-oid="r9.0mqt">
                                            Product
                                        </span>
                                        {sortBy === 'name' && (
                                            <span className="text-slate-600" data-oid="4dapibo">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead data-oid="23iai33">SKU</TableHead>
                                <TableHead data-oid="bl1h.nv">Category</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('stock')}
                                    data-oid="_-.vhut"
                                >
                                    <div className="flex items-center space-x-1" data-oid="dtm9nt9">
                                        <span className="font-semibold" data-oid="m9woe4q">
                                            Stock
                                        </span>
                                        {sortBy === 'stock' && (
                                            <span className="text-blue-600" data-oid="eira:qx">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('price')}
                                    data-oid="mpdf_3x"
                                >
                                    <div className="flex items-center space-x-1" data-oid="vjm-2ez">
                                        <span className="font-semibold" data-oid="0-_q8kb">
                                            Price
                                        </span>
                                        {sortBy === 'price' && (
                                            <span className="text-blue-600" data-oid="ye1touz">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead data-oid="ktj.pp9">Expiry</TableHead>
                                <TableHead data-oid="24jmax7">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody data-oid="semfmrq">
                            {filteredProducts.map((product) => {
                                const stockStatus = getStockStatus(product);
                                return (
                                    <TableRow
                                        key={product.id}
                                        className="hover:bg-gray-50 transition-colors"
                                        data-oid="kgndl0g"
                                    >
                                        <TableCell data-oid="s37snc2">
                                            <div
                                                className="flex items-center justify-center"
                                                data-oid="nzno4hg"
                                            >
                                                {/* Updated to handle R2 images */}
                                                {(product.images && product.images.length > 0) ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover border-2 border-slate-200 shadow-sm"
                                                        onError={(e) => {
                                                            const target =
                                                                e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            target.nextElementSibling?.classList.remove(
                                                                'hidden',
                                                            );
                                                        }}
                                                        data-oid="4ucyqwh"
                                                    />
                                                ) : null}
                                                <div
                                                    className={`w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-slate-200 ${(product.images && product.images.length > 0) ? 'hidden' : ''}`}
                                                    data-oid="ztl2f_z"
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-slate-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="gy6mn4g"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            data-oid="mcyspkk"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="q4a-x3v">
                                            <div data-oid="1q1h6:e">
                                                <div
                                                    className="font-medium text-gray-900"
                                                    data-oid="t1e1kou"
                                                >
                                                    {product.productName}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-500"
                                                    data-oid="k28ok8."
                                                >
                                                    {product.productId.nameAr}
                                                </div>
                                                <div
                                                    className="text-xs text-gray-400 mt-1"
                                                    data-oid="88qxiio"
                                                >
                                                    {product.activeIngredient} • {product.dosage} •{' '}
                                                    {product.form}
                                                </div>
                                                {product.prescriptionRequired && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mt-1 text-xs bg-red-50 text-red-700"
                                                        data-oid="_:8fymy"
                                                    >
                                                        Prescription Required
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid=":jd7afd">
                                            <code
                                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                                                data-oid="j0bw-u_"
                                            >
                                                {product.sku}
                                            </code>
                                        </TableCell>
                                        <TableCell data-oid="guqy-pb">
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 text-blue-700"
                                                data-oid="vq33kwh"
                                            >
                                                {product.productId.category.replace('-', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell data-oid="mk3tw_m">
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="kjevvgj"
                                            >
                                                <span className="font-medium" data-oid="tykw--b">
                                                    {product.stock}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={getStockBadgeColor(stockStatus)}
                                                    data-oid="7:y1irj"
                                                >
                                                    {stockStatus.charAt(0).toUpperCase() +
                                                        stockStatus.slice(1)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="dx2xm_.">
                                            <div className="flex flex-col" data-oid="v0n69c9">
                                                {product.discount && product.discount.isActive ? (
                                                    <>
                                                        <span
                                                            className="text-sm text-gray-500 line-through"
                                                            data-oid="0:zoqgm"
                                                        >
                                                             EGP {viewingProduct && viewingProduct.price}
                                                        </span>
                                                        <span
                                                            className="font-medium text-green-600"
                                                            data-oid="1pcpgha"
                                                        >
                                                            EGP{' '}
                                                            {product.price}
                                                        </span>
                                                        {getDiscountBadge(product)}
                                                    </>
                                                ) : (
                                                    <span
                                                        className="font-medium text-green-600"
                                                        data-oid="cbeocm7"
                                                    >
                                                         EGP {product.price}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="hiljwpz">
                                            <div className="text-sm" data-oid="iccc_lk">
                                                {product.expiryDate &&
                                                    new Date(
                                                        product.expiryDate,
                                                    ).toLocaleDateString()}
                                            </div>
                                            {product.batchNumber && (
                                                <div
                                                    className="text-xs text-gray-500"
                                                    data-oid="032u8m-"
                                                >
                                                    Batch: {product.batchNumber}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell data-oid="9d1h2hw">
                                            <div
                                                className="flex items-center space-x-2 relative"
                                                data-oid="ur07_jg"
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={() => handleEditProduct(product)}
                                                    data-oid=".4_dr1s"
                                                >
                                                    Edit
                                                </Button>
                                                <div className="relative" data-oid="nji.059">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs"
                                                        onClick={() =>
                                                            handleDropdownToggle(product._id)
                                                        }
                                                        data-oid="to874nx"
                                                    >
                                                        •••
                                                    </Button>

                                                    {showDropdown === product._id && (
                                                        <div
                                                            className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                                            data-oid="cr1-.hw"
                                                        >
                                                            <div
                                                                className="py-1"
                                                                data-oid="rjegmw6"
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        handleViewDetails(product)
                                                                    }
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    data-oid=".zce:ct"
                                                                >
                                                                    View Details
                                                                </button>
                                                                <div
                                                                    className="border-t border-gray-100 my-1"
                                                                    data-oid="2bhqsyh"
                                                                ></div>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteProduct(
                                                                            product._id,
                                                                        )
                                                                    }
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                    data-oid="g2c7ud8"
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
                        <div className="text-center py-12" data-oid="-nr9_.y">
                            <div className="mb-4 flex justify-center" data-oid="q-:m6z0">
                                <svg
                                    className="w-16 h-16 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="a:yxuzf"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        data-oid="lc6c_y7"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-2"
                                data-oid="1dxf63a"
                            >
                                No products found
                            </h3>
                            <p className="text-gray-600 mb-4" data-oid="jnckkz9">
                                Try adjusting your search or filter criteria.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedSupplier('all');
                                    setSelectedStockLevel('all');
                                }}
                                data-oid="wko_gm2"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    data-oid="c0ny7t:"
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        data-oid="zt2.4yu"
                    >
                        <div className="p-6 border-b border-gray-200" data-oid="jgai4d4">
                            <div className="flex items-center justify-between" data-oid="vzn_2yn">
                                <h2 className="text-xl font-bold text-gray-900" data-oid="gir6-s4">
                                    Add New Product
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddModal(false)}
                                    data-oid="-4zms_y"
                                >
                                    ×
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4" data-oid="6zd8ud1">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="v7ptd4z"
                            >
                                <div data-oid="d5047:i">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="jm6fys0"
                                    >
                                        Product Name *
                                    </label>
                                    <Input
                                        value={newProduct.name}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, name: e.target.value })
                                        }
                                        placeholder="e.g., Paracetamol 500mg"
                                        data-oid="ba2s33f"
                                    />
                                </div>
                                <div data-oid="2tr9e5u">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="xizt6p6"
                                    >
                                        Arabic Name
                                    </label>
                                    <Input
                                        value={newProduct.nameAr}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, nameAr: e.target.value })
                                        }
                                        placeholder="e.g., باراسيتامول ٥٠٠ مجم"
                                        data-oid="3bohtv8"
                                    />
                                </div>
                                <div data-oid="kgb.f4.">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="q9x0hik"
                                    >
                                        SKU *
                                    </label>
                                    <Input
                                        value={newProduct.sku}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, sku: e.target.value })
                                        }
                                        placeholder="e.g., MED-PAR-500-001"
                                        data-oid="syj9b.3"
                                    />
                                </div>
                                <div data-oid="8:r6_4n">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="s25zpl5"
                                    >
                                        Category *
                                    </label>
                                    <Select
                                        value={newProduct.category}
                                        onValueChange={(value) =>
                                            setNewProduct({ ...newProduct, category: value })
                                        }
                                        data-oid="faxzddt"
                                    >
                                        <SelectTrigger data-oid="w7-2m9l">
                                            <SelectValue data-oid="xxd2ks." />
                                        </SelectTrigger>
                                        <SelectContent data-oid="xjwsstw">
                                            {categories
                                                .filter((cat) => cat !== 'all')
                                                .map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                        data-oid="8vrvt7."
                                                    >
                                                        {category.charAt(0).toUpperCase() +
                                                            category.slice(1).replace('-', ' ')}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div data-oid="n20e-10">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="z4-qc1x"
                                    >
                                        Active Ingredient *
                                    </label>
                                    <Input
                                        value={newProduct.activeIngredient}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                activeIngredient: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Paracetamol"
                                        data-oid="zmtw6w4"
                                    />
                                </div>
                                <div data-oid="_2g762q">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="gz46ohf"
                                    >
                                        Dosage *
                                    </label>
                                    <Input
                                        value={newProduct.dosage}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, dosage: e.target.value })
                                        }
                                        placeholder="e.g., 500mg"
                                        data-oid="j94pity"
                                    />
                                </div>
                                <div data-oid="h29suaw">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="73rskao"
                                    >
                                        Form *
                                    </label>
                                    <Select
                                        value={newProduct.form}
                                        onValueChange={(value) =>
                                            setNewProduct({ ...newProduct, form: value })
                                        }
                                        data-oid="k.mdt7:"
                                    >
                                        <SelectTrigger data-oid="0fypoe:">
                                            <SelectValue data-oid="hq0t3.m" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="na7-ui0">
                                            <SelectItem value="Tablet" data-oid="wnuqmzw">
                                                Tablet
                                            </SelectItem>
                                            <SelectItem value="Capsule" data-oid="d-s44yb">
                                                Capsule
                                            </SelectItem>
                                            <SelectItem value="Syrup" data-oid="7tvpat_">
                                                Syrup
                                            </SelectItem>
                                            <SelectItem value="Injection" data-oid="o3fvs.1">
                                                Injection
                                            </SelectItem>
                                            <SelectItem value="Cream" data-oid="ttybsoq">
                                                Cream
                                            </SelectItem>
                                            <SelectItem value="Ointment" data-oid="gl2df6y">
                                                Ointment
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div data-oid="ei3azut">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="vp645tp"
                                    >
                                        Price (EGP) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, price: e.target.value })
                                        }
                                        placeholder="0.00"
                                        data-oid="ut359so"
                                    />
                                </div>
                                <div data-oid="y0h2l5y">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="k0dnjmi"
                                    >
                                        Stock Quantity *
                                    </label>
                                    <Input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, stock: e.target.value })
                                        }
                                        placeholder="0"
                                        data-oid="yq0m0eu"
                                    />
                                </div>
                                <div data-oid="_cymh2y">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="zd0scu5"
                                    >
                                        Expiry Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={newProduct.expiryDate}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                expiryDate: e.target.value,
                                            })
                                        }
                                        data-oid=":1skubz"
                                    />
                                </div>
                                <div data-oid="vn670e8">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="j-2h2z5"
                                    >
                                        Batch Number
                                    </label>
                                    <Input
                                        value={newProduct.batchNumber}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                batchNumber: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., PAR2024001"
                                        data-oid="-q8-frg"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2" data-oid="95j6_v2">
                                <input
                                    type="checkbox"
                                    id="prescription"
                                    checked={newProduct.prescriptionRequired}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            prescriptionRequired: e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-300"
                                    data-oid="ck.kcir"
                                />

                                <label
                                    htmlFor="prescription"
                                    className="text-sm text-gray-700"
                                    data-oid="s7p2iz4"
                                >
                                    Prescription Required
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200" data-oid="f.0xt86">
                            <div className="flex space-x-3" data-oid="v5a4q6g">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleSaveNewProduct}
                                    disabled={
                                        !newProduct.name ||
                                        !newProduct.sku ||
                                        !newProduct.activeIngredient ||
                                        !newProduct.price ||
                                        !newProduct.stock
                                    }
                                    data-oid="df0y-91"
                                >
                                    Add Product
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowAddModal(false)}
                                    data-oid="7j--928"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewDetailsModal && viewingProduct && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    data-oid="ppo1sx."
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        data-oid="5emogyl"
                    >
                        <div className="p-6 border-b border-gray-200" data-oid="..pk3cm">
                            <div className="flex items-center justify-between" data-oid="cqboct7">
                                <h2 className="text-xl font-bold text-gray-900" data-oid="sqr.iya">
                                    Product Details
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowViewDetailsModal(false)}
                                    data-oid="92bongo"
                                >
                                    ×
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6" data-oid="bmqhdye">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="ca11p_-"
                            >
                                <div data-oid="ads361g">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="x0dltuq"
                                    >
                                        Product Name
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="b932aob"
                                    >
                                        <div
                                            className="font-medium text-gray-900"
                                            data-oid="-pf9g-7"
                                        >
                                            {viewingProduct && viewingProduct.productName}
                                        </div>
                                        {viewingProduct.nameAr && (
                                            <div
                                                className="text-sm text-gray-600 mt-1"
                                                data-oid="bp:_tfr"
                                            >
                                                {viewingProduct && viewingProduct.productId.nameAr}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div data-oid="sv462mu">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="u4wezih"
                                    >
                                        SKU
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="aorl1d8"
                                    >
                                        <code className="text-sm font-mono" data-oid="0v74my2">
                                            {viewingProduct && viewingProduct.sku}
                                        </code>
                                    </div>
                                </div>
                                <div data-oid="zgcr_.s">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="yosb1h."
                                    >
                                        Category
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid=".812k4r"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700"
                                            data-oid="-akxei5"
                                        >
                                            {viewingProduct.productId.category.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                                <div data-oid="9ehkdvo">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="mykt:.x"
                                    >
                                        Stock Quantity
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="xo23kbg"
                                    >
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="t-tpyze"
                                        >
                                            <span className="font-medium" data-oid="k2z:f8s">
                                                {viewingProduct && viewingProduct.stock}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={getStockBadgeColor(
                                                    getStockStatus(viewingProduct && viewingProduct),
                                                )}
                                                data-oid="3trw2tp"
                                            >
                                                {getStockStatus(viewingProduct && viewingProduct)
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    getStockStatus(viewingProduct && viewingProduct).slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div data-oid="cp6:5p9">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="_x-83p8"
                                    >
                                        Price
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="wbuhz5t"
                                    >
                                        <span
                                            className="font-medium text-green-600"
                                            data-oid="_9-pxcr"
                                        >
                                            EGP {viewingProduct && viewingProduct.price}
                                        </span>
                                    </div>
                                </div>
                                <div data-oid="a:zvcx_">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="vfr7g5p"
                                    >
                                        Expiry Date
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="b2z22e2"
                                    >
                                        {viewingProduct && viewingProduct.expiryDate
                                            ? new Date(
                                                  viewingProduct.expiryDate,
                                              ).toLocaleDateString()
                                            : 'Not specified'}
                                    </div>
                                </div>
                                <div data-oid="ex4z-5b">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="kk-jf9a"
                                    >
                                        Batch Number
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="2g4_kf."
                                    >
                                        {viewingProduct.batchNumber || 'Not specified'}
                                    </div>
                                </div>
                                <div data-oid="4_.rci9">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="n0xmz73"
                                    >
                                        Active Ingredient
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="89d3mpt"
                                    >
                                        {viewingProduct && viewingProduct.activeIngredient}
                                    </div>
                                </div>
                                <div data-oid="z3z2gys">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="36161:b"
                                    >
                                        Dosage
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="v0tv02-"
                                    >
                                        {viewingProduct && viewingProduct.dosage}
                                    </div>
                                </div>
                                <div data-oid="plkq3wr">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="_fefh:p"
                                    >
                                        Form
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid=":qns07h"
                                    >
                                        {viewingProduct.form}
                                    </div>
                                </div>
                            </div>

                            <div data-oid="yhmuk7:">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="qdfpo8e"
                                >
                                    Description
                                </label>
                                <div
                                    className="p-3 bg-gray-50 rounded-lg border"
                                    data-oid="3n4u-iw"
                                >
                                    {viewingProduct.description}
                                </div>
                            </div>

                            <div data-oid="8bz21s5">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="0j:3gp0"
                                >
                                    Prescription Required
                                </label>
                                <div
                                    className="p-3 bg-gray-50 rounded-lg border"
                                    data-oid="_vag7mh"
                                >
                                    {viewingProduct.prescriptionRequired ? (
                                        <Badge
                                            variant="outline"
                                            className="bg-red-50 text-red-700"
                                            data-oid="g_jc39k"
                                        >
                                            Yes - Prescription Required
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700"
                                            data-oid="df-:jx5"
                                        >
                                            No - Over the Counter
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {viewingProduct.minStockThreshold && (
                                <div data-oid="t63oxeq">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="l4f9i65"
                                    >
                                        Minimum Stock Threshold
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="aj90tcl"
                                    >
                                        {viewingProduct.minStockThreshold} units
                                    </div>
                                </div>
                            )}

                            {viewingProduct.notes && (
                                <div data-oid="wja.-q-">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="5_3rmin"
                                    >
                                        Notes
                                    </label>
                                    <div
                                        className="p-3 bg-gray-50 rounded-lg border"
                                        data-oid="r_v7pqo"
                                    >
                                        {viewingProduct.notes}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200" data-oid="ozzzf85">
                            <div className="flex space-x-3" data-oid="oghvm3m">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => {
                                        setShowViewDetailsModal(false);
                                        handleEditProduct(viewingProduct);
                                    }}
                                    data-oid="215rv8c"
                                >
                                    Edit Product
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowViewDetailsModal(false)}
                                    data-oid="jfns0wa"
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
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    data-oid="5k-25.p"
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        data-oid="6ffepqx"
                    >
                        <div className="p-6 border-b border-gray-200" data-oid="so5d8nw">
                            <div className="flex items-center justify-between" data-oid="l6x50gg">
                                <h2 className="text-xl font-bold text-gray-900" data-oid="gafroox">
                                    Edit Product
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowEditModal(false)}
                                    data-oid="wq6sekc"
                                >
                                    ×
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4" data-oid="hv6t_-y">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="bylk.0u"
                            >
                                <div data-oid="x3va65s">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="abq7drq"
                                    >
                                        Price (EGP) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.price}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                price: parseFloat(e.target.value),
                                            })
                                        }
                                        data-oid="sq_2rs0"
                                    />
                                </div>
                                <div data-oid="ebuc_t6">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="9wd8ijn"
                                    >
                                        Stock Quantity *
                                    </label>
                                    <Input
                                        type="number"
                                        value={editingProduct.stockQuantity || 0}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                stock: parseInt(e.target.value),
                                            })
                                        }
                                        data-oid="z2oaxma"
                                    />
                                </div>
                                <div data-oid="-_px1gr">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="ke0jlx-"
                                    >
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
                                        data-oid="kdbp_zy"
                                    />
                                </div>
                                <div data-oid="yef1utu">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="4:5a:3a"
                                    >
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
                                        data-oid="k8prda9"
                                    />
                                </div>
                            </div>

                            {/* Discount Section */}
                            <div className="border-t border-gray-200 pt-4" data-oid="y2.9s96">
                                <h3
                                    className="text-lg font-medium text-gray-900 mb-4"
                                    data-oid="6zp5u-i"
                                >
                                    Discount Settings
                                </h3>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    data-oid="81sa..l"
                                >
                                    <div data-oid="e2x5l1c">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="ave53g3"
                                        >
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
                                                        isActive:
                                                            editingProduct.discount?.isActive ||
                                                            false,
                                                    },
                                                })
                                            }
                                            data-oid="77126sn"
                                        >
                                            <SelectTrigger data-oid="7w1c7:o">
                                                <SelectValue data-oid="3ofcj18" />
                                            </SelectTrigger>
                                            <SelectContent data-oid="73bka_f">
                                                <SelectItem value="percentage" data-oid="_d_796:">
                                                    Percentage (%)
                                                </SelectItem>
                                                <SelectItem value="fixed" data-oid="a968rqb">
                                                    Fixed Amount (EGP)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div data-oid="iwac:hx">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="ij_lsxl"
                                        >
                                            Discount Value
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max={
                                                editingProduct.discount?.type === 'percentage'
                                                    ? 100
                                                    : undefined
                                            }
                                            value={editingProduct.discount?.value || 0}
                                            onChange={(e) =>
                                                setEditingProduct({
                                                    ...editingProduct,
                                                    discount: {
                                                        ...editingProduct.discount,
                                                        type:
                                                            editingProduct.discount?.type ||
                                                            'percentage',
                                                        value: parseFloat(e.target.value) || 0,
                                                        isActive:
                                                            editingProduct.discount?.isActive ||
                                                            false,
                                                    },
                                                })
                                            }
                                            placeholder={
                                                editingProduct.discount?.type === 'percentage'
                                                    ? '0-100'
                                                    : '0.00'
                                            }
                                            data-oid="r9frxnu"
                                        />
                                    </div>
                                    <div data-oid="lj5hqbm">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="ldia_jt"
                                        >
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
                                                        type:
                                                            editingProduct.discount?.type ||
                                                            'percentage',
                                                        value: editingProduct.discount?.value || 0,
                                                        startDate: e.target.value,
                                                        isActive:
                                                            editingProduct.discount?.isActive ||
                                                            false,
                                                    },
                                                })
                                            }
                                            data-oid="uu7hqv2"
                                        />
                                    </div>
                                    <div data-oid="_atwd6_">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="_:jy:76"
                                        >
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
                                                        type:
                                                            editingProduct.discount?.type ||
                                                            'percentage',
                                                        value: editingProduct.discount?.value || 0,
                                                        endDate: e.target.value,
                                                        isActive:
                                                            editingProduct.discount?.isActive ||
                                                            false,
                                                    },
                                                })
                                            }
                                            data-oid="810r3_y"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-2 mt-4"
                                    data-oid="51.fr4-"
                                >
                                    <input
                                        type="checkbox"
                                        id="discountActive"
                                        checked={editingProduct.discount?.isActive || false}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                discount: {
                                                    ...editingProduct.discount,
                                                    type:
                                                        editingProduct.discount?.type ||
                                                        'percentage',
                                                    value: editingProduct.discount?.value || 0,
                                                    isActive: e.target.checked,
                                                },
                                            })
                                        }
                                        className="rounded border-gray-300"
                                        data-oid="t6a8o5e"
                                    />

                                    <label
                                        htmlFor="discountActive"
                                        className="text-sm text-gray-700"
                                        data-oid="og4q27w"
                                    >
                                        Enable Discount
                                    </label>
                                </div>
                                {editingProduct.discount?.isActive &&
                                    editingProduct.discount?.value > 0 && (
                                        <div
                                            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                                            data-oid=".0llald"
                                        >
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="2.sqs-7"
                                            >
                                                <span
                                                    className="text-sm font-medium text-green-800"
                                                    data-oid="2xxi7t4"
                                                >
                                                    Discounted Price Preview:
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid=":2wcfx1"
                                                >
                                                    <span
                                                        className="text-sm text-gray-500 line-through"
                                                        data-oid="v4-sbq2"
                                                    >
                                                         EGP {viewingProduct.price}
                                                    </span>
                                                    <span
                                                        className="text-lg font-bold text-green-600"
                                                        data-oid="4ub1ftq"
                                                    >
                                                        EGP{' '}
                                                        {viewingProduct.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200" data-oid="y4knlp_">
                            <div className="flex space-x-3" data-oid="cmhzkju">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={()=>{handleUpdateProduct(editingProduct._id, editingProduct)}}
                                    data-oid="9t-i54y"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowEditModal(false)}
                                    data-oid="46:f7xg"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Selection Modal */}
            <ProductSelectionModal
                isOpen={showProductSelectionModal}
                setAddedProduct = {setAddedProduct}
                onClose={() => setShowProductSelectionModal(false)}
                onSelectProduct={handleProductSelection}
                data-oid="ts3crty"
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    data-oid="l5:8844"
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-md shadow-xl"
                        data-oid="g9ev5i7"
                    >
                        <div className="p-6 border-b border-gray-200" data-oid="upc6jp-">
                            <div className="flex items-center space-x-3" data-oid="lfguspw">
                                <div
                                    className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center"
                                    data-oid="if.vvlm"
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="cs1:ils"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            data-oid="j28n0uu"
                                        />
                                    </svg>
                                </div>
                                <div data-oid="nd2wteq">
                                    <h2
                                        className="text-xl font-bold text-gray-900"
                                        data-oid="z4i7roi"
                                    >
                                        Delete Product
                                    </h2>
                                    <p className="text-sm text-gray-600" data-oid="30-3252">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6" data-oid="sroks6g">
                            <p className="text-gray-700 mb-4" data-oid="wfo5-:g">
                                Are you sure you want to delete this product from your inventory?
                                This will permanently remove all product information and cannot be
                                undone.
                            </p>
                            <div
                                className="bg-red-50 border border-red-200 rounded-lg p-3"
                                data-oid="2eh8su4"
                            >
                                <div className="flex items-center space-x-2" data-oid="er-9nl_">
                                    <svg
                                        className="w-5 h-5 text-red-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="051aehs"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                            data-oid="wo3akkz"
                                        />
                                    </svg>
                                    <span
                                        className="text-red-700 text-sm font-medium"
                                        data-oid="ox7dygg"
                                    >
                                        Warning: This action is permanent and cannot be reversed
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50" data-oid="tjlb60i">
                            <div className="flex space-x-3" data-oid="bot6sh6">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={cancelDeleteProduct}
                                    data-oid="lqvj-jk"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={confirmDeleteProduct}
                                    data-oid="-h9xiq9"
                                >
                                    Delete Product
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Notification */}
            <ProductAddedNotification
                isVisible={showNotification}
                productName={addedProductName}
                onClose={() => setShowNotification(false)}
                data-oid=":a6fz0r"
            />
        </div>
    );
}
