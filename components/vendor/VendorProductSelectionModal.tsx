'use client';

import { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { filterProducts } from '@/lib/data/products';
import { extendedMedicineData, ExtendedMedicine } from '@/lib/data/medicineData';
import { BRAND_COLORS } from '@/lib/constants';
import { Logo } from '@/components/ui/Logo';
import { getAuthToken } from '@/lib/utils/cookies';

interface VendorProductSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProduct: (product: Product | ExtendedMedicine, inventoryData: InventoryData) => void;
    setAddedProduct: any;
}

interface InventoryData {
    stock: number;
    price: number;
    expiryDate: string;
    batchNumber: string;
    minStockThreshold: number;
}

export function VendorProductSelectionModal({
    isOpen,
    onClose,
    setAddedProduct,
    onSelectProduct,
}: VendorProductSelectionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | ExtendedMedicine | null>(null);
    const [showInventoryForm, setShowInventoryForm] = useState(false);
    const [inventoryData, setInventoryData] = useState<InventoryData>({
        stock: 0,
        price: 0,
        expiryDate: '',
        batchNumber: '',
        minStockThreshold: 10,
    });
    const [allProducts, setAllProducts] = useState([]);

    const loadProductsFromServer = async () => {
        const data = await filterProducts({});
        setAllProducts(data.products);
    }

    const categories = [
        'all',
        'pain-relief',
        'antibiotics',
        'vitamins',
        'supplements',
        'skincare',
        'baby',
        'medical',
        'otc',
        'prescription',
    ];

    const filteredProducts = useMemo(() => {
        console.log('filtered')
        let filtered = allProducts;

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    (product.nameAr && product.nameAr.includes(searchQuery)) ||
                    product.manufacturer.toLowerCase().includes(query) ||
                    (product.activeIngredient &&
                        product.activeIngredient.toLowerCase().includes(query)) ||
                    product.tags.some((tag) => tag.toLowerCase().includes(query)),
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((product) => product.category === selectedCategory);
        }
        console.log('all products : ', allProducts, ' filtered: ', filtered)
        return filtered;
    }, [allProducts, searchQuery, selectedCategory]);

    const handleProductSelect = (product: Product | ExtendedMedicine) => {
        setSelectedProduct(product);
        setShowInventoryForm(true);

        // Pre-fill some data if available
        if ('price' in product) {
            setInventoryData((prev) => ({
                ...prev,
                price: product.price,
            }));
        }
    };

    const getUser = async (): Promise<string> => {
        const token = Cookies.get('authToken')
        const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
        const data = await user.json()
        console.log(data)
        return data.data.vendor._id;
    }

    const handleAddToInventory = async () => {
        try {
            const product = selectedProduct;
            const vendorId = await getUser();
            const token = getAuthToken();
            // setIsSubmitting(true);

            // const validationErrors = validateInventoryData(inventoryData);
            // if (validationErrors.length > 0) {
            //     showNotification({
            //         type: 'error',
            //         message: 'Validation Error',
            //         description: validationErrors.join(', ')
            //     });
            //     return;
            // }

            const productPayload = {
                productId: product._id,
                productName: product.name,
                sku: inventoryData.batchNumber || `SKU-${product.id}-${Date.now()}`,
                price: parseFloat(inventoryData.price),
                originalPrice: getProductPrice(product),
                stockQuantity: parseInt(inventoryData.stock),
                minimumOrderQuantity: 1,
                maximumOrderQuantity: inventoryData.stock > 100 ? Math.floor(inventoryData.stock / 10) : inventoryData.stock,
                deliveryTime: "1-2 days",
                deliveryFee: 0,
                specialOffers: [],
                bulkPricing: []
            };
            console.log('adding product', productPayload)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/add-product/${vendorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to add product to inventory');
            }

            // showNotification({
            //     type: 'success',
            //     message: `${product.name} added successfully!`,
            //     description: `Stock: ${inventoryData.stock} units at EGP ${inventoryData.price} each`
            // });

            // if (onProductAdded) {
            //     onProductAdded(data.data.product);
            // }
            setAddedProduct(data.data.inventory)
            handleClose();

        } catch (error) {
            console.error('Error adding product:', error);
            // showNotification({
            //     type: 'error',
            //     message: 'Failed to add product',
            //     description: error.message || 'Something went wrong while adding the product to your inventory'
            // });
        } finally {
            // setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedProduct(null);
        setShowInventoryForm(false);
        setInventoryData({
            stock: 0,
            price: 0,
            expiryDate: '',
            batchNumber: '',
            minStockThreshold: 10,
        });
        onClose();
    };

    const getProductImage = (product: Product | ExtendedMedicine) => {
        // Check R2 images array first
        if ('images' in product && product.images && Array.isArray(product.images) && product.images.length > 0) {
            return product.images[0].url;
        }
        
        return '/api/placeholder/300/300';
    };

    const getProductPrice = (product: Product | ExtendedMedicine) => {
        if ('price' in product) {
            console.log(product.price)
            return product.price || product.overallAveragePrice;
        }
        if ('pharmacyMapping' in product) {
            return product.pharmacyMapping.averagePrice;
        }
        return 0;
    };

    useEffect(() => {
        loadProductsFromServer()
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} data-oid="-u..03n">
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden" data-oid="ri_cti5">
                <DialogHeader className="border-b border-gray-200 pb-4" data-oid="gbkespi">
                    <div className="flex items-center justify-between" data-oid="cjv2lox">
                        <div className="flex items-center space-x-3" data-oid="pv00ww6">
                            {showInventoryForm ? (
                                <Button
                                    onClick={() => setShowInventoryForm(false)}
                                    variant="ghost"
                                    className="text-[#1F1F6F] hover:bg-[#1F1F6F]/10 p-2"
                                    data-oid="irwumor"
                                >
                                    <span className="mr-2" data-oid="68a:u.y">
                                        ←
                                    </span>
                                    Back to Products
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleClose}
                                    variant="ghost"
                                    className="text-[#1F1F6F] hover:bg-[#1F1F6F]/10 p-2"
                                    data-oid="__wx3si"
                                >
                                    <span className="mr-2" data-oid="-:vdvjc">
                                        ×
                                    </span>
                                    Close
                                </Button>
                            )}
                        </div>
                        <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white border-none"
                            data-oid="ypvitj4"
                        >
                            {filteredProducts.length} Products Available
                        </Badge>
                    </div>
                </DialogHeader>

                {!showInventoryForm ? (
                    <div className="flex flex-col h-[70vh]" data-oid="4s60ynn">
                        {/* Search and Filters */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50" data-oid="gz1_9l4">
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid="bus_7iu"
                            >
                                <div className="md:col-span-2" data-oid="0r-o0x6">
                                    <Input
                                        placeholder="Search products by name, ingredient, manufacturer..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="pqhgvka"
                                    />
                                </div>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    data-oid=".ke9va0"
                                >
                                    <SelectTrigger
                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="tn4rx51"
                                    >
                                        <SelectValue placeholder="Category" data-oid="v4wlf2v" />
                                    </SelectTrigger>
                                    <SelectContent data-oid="g5xc52h">
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                                data-oid="t6_ndnf"
                                            >
                                                {category === 'all'
                                                    ? 'All Categories'
                                                    : category.charAt(0).toUpperCase() +
                                                      category.slice(1).replace('-', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1 overflow-y-auto p-4" data-oid="jn6p-o8">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                data-oid="8lz_bv1"
                            >
                                {filteredProducts.map((product) => (
                                    <Card
                                        key={`${product.type}-${product.id}`}
                                        className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-[#1F1F6F]/30 cursor-pointer group"
                                        onClick={() => handleProductSelect(product)}
                                        data-oid="iw0_42v"
                                    >
                                        <CardHeader className="p-4" data-oid="w314.xo">
                                            <div className="relative" data-oid="ax0j8lp">
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.name}
                                                    className="w-full h-32 object-cover rounded-lg bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/api/placeholder/300/300';
                                                    }}
                                                    data-oid="xugp291"
                                                />

                                                <div
                                                    className="absolute top-2 right-2"
                                                    data-oid="kf7enjj"
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-white/90 text-[#1F1F6F] border-[#1F1F6F]/20"
                                                        data-oid="_rj_vod"
                                                    >
                                                        {product.type === 'medicine'
                                                            ? 'Medicine'
                                                            : 'Product'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0" data-oid="mwqg3v8">
                                            <div className="space-y-2" data-oid=".rgod67">
                                                <h3
                                                    className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1F1F6F] transition-colors"
                                                    data-oid="iwan.fx"
                                                >
                                                    {product.name}
                                                </h3>
                                                {product.nameAr && (
                                                    <p
                                                        className="text-sm text-gray-600 line-clamp-1"
                                                        data-oid="h7if-rd"
                                                    >
                                                        {product.nameAr}
                                                    </p>
                                                )}
                                                <div
                                                    className="flex items-center justify-between"
                                                    data-oid="335i.0c"
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                        data-oid="hhtwdqz"
                                                    >
                                                        {product.category.replace('-', ' ')}
                                                    </Badge>
                                                    <span
                                                        className="font-bold text-[#1F1F6F]"
                                                        data-oid=":8nir7x"
                                                    >
                                                        EGP {getProductPrice(product)}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-xs text-gray-500 line-clamp-2"
                                                    data-oid="5q2-h4q"
                                                >
                                                    {product.manufacturer}
                                                </p>
                                                {product.activeIngredient && (
                                                    <p
                                                        className="text-xs text-gray-600"
                                                        data-oid="_0zdl9r"
                                                    >
                                                        <span
                                                            className="font-medium"
                                                            data-oid="h5ec46."
                                                        >
                                                            Active:
                                                        </span>{' '}
                                                        {product.activeIngredient}
                                                    </p>
                                                )}
                                                {'requiresPrescription' in product &&
                                                    product.requiresPrescription && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs bg-red-50 text-red-700 border-red-200"
                                                            data-oid="5r4bmej"
                                                        >
                                                            Prescription Required
                                                        </Badge>
                                                    )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12" data-oid="8s0kz6o">
                                    <div className="text-6xl mb-4" data-oid="6pimplq">
                                        🔍
                                    </div>
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="ftrfzvt"
                                    >
                                        No products found
                                    </h3>
                                    <p className="text-gray-600 mb-4" data-oid="jwb8.2p">
                                        Try adjusting your search criteria or browse different
                                        categories.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}
                                        className="border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white"
                                        data-oid="-4dt_v1"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 max-h-[70vh] overflow-y-auto" data-oid="cjth4k8">
                        {/* Selected Product Details */}
                        <div
                            className="mb-6 p-4 bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 rounded-lg border border-[#1F1F6F]/20"
                            data-oid="crlkt-m"
                        >
                            <div className="flex items-start space-x-4" data-oid="wn.iuhc">
                                <img
                                    src={getProductImage(selectedProduct!)}
                                    alt={selectedProduct!.name}
                                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/api/placeholder/300/300';
                                    }}
                                    data-oid="brtv2y4"
                                />

                                <div className="flex-1" data-oid=":wzfw2j">
                                    <h3
                                        className="text-lg font-bold text-[#1F1F6F] mb-1"
                                        data-oid="s20go-x"
                                    >
                                        {selectedProduct!.name}
                                    </h3>
                                    {selectedProduct!.nameAr && (
                                        <p className="text-gray-600 mb-2" data-oid="kad75y9">
                                            {selectedProduct!.nameAr}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2" data-oid="dxbqg.y">
                                        <Badge
                                            variant="outline"
                                            className="bg-white"
                                            data-oid=".v2y_us"
                                        >
                                            {selectedProduct!.manufacturer}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-white"
                                            data-oid="sv0_i.i"
                                        >
                                            {selectedProduct!.category.replace('-', ' ')}
                                        </Badge>
                                        {selectedProduct!.activeIngredient && (
                                            <Badge
                                                variant="outline"
                                                className="bg-white"
                                                data-oid="d_rnguf"
                                            >
                                                {selectedProduct!.activeIngredient}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Form */}
                        <div className="space-y-6" data-oid="gycm7ex">
                            <div className="flex items-center space-x-2 mb-4" data-oid="4rvtp9g">
                                <Logo size="sm" data-oid="sg46ihm" />
                                <h4
                                    className="text-lg font-semibold text-[#1F1F6F]"
                                    data-oid="57p:542"
                                >
                                    Inventory Information
                                </h4>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="_phd7e2"
                            >
                                <div data-oid="fsjc65:">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="6ca2ryx"
                                    >
                                        Stock Quantity *
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={inventoryData.stock === 0 ? '' : inventoryData.stock}
                                        onChange={(e) =>
                                            setInventoryData((prev) => ({
                                                ...prev,
                                                stock:
                                                    e.target.value === ''
                                                        ? 0
                                                        : parseInt(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="Enter stock quantity"
                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="mxblq_g"
                                    />
                                </div>

                                <div data-oid="oahywqz">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="lay42o_"
                                    >
                                        Price (EGP) *
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={inventoryData.price === 0 ? '' : inventoryData.price}
                                        onChange={(e) =>
                                            setInventoryData((prev) => ({
                                                ...prev,
                                                price:
                                                    e.target.value === ''
                                                        ? 0
                                                        : parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="Enter price"
                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="53yz67v"
                                    />
                                </div>

                                <div data-oid="nx64w-i">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="ka10juv"
                                    >
                                        Expiry Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={inventoryData.expiryDate}
                                        onChange={(e) =>
                                            setInventoryData((prev) => ({
                                                ...prev,
                                                expiryDate: e.target.value,
                                            }))
                                        }
                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="2a830l4"
                                    />
                                </div>

                                <div data-oid="onfm1_e">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="zac.39t"
                                    >
                                        Batch Number
                                    </label>
                                    <Input
                                        value={inventoryData.batchNumber}
                                        onChange={(e) =>
                                            setInventoryData((prev) => ({
                                                ...prev,
                                                batchNumber: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter batch number"
                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="897hlxp"
                                    />
                                </div>

                                <div data-oid="gti8bjo">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="qmqybwu"
                                    >
                                        Minimum Stock Threshold
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={
                                            inventoryData.minStockThreshold === 10
                                                ? ''
                                                : inventoryData.minStockThreshold
                                        }
                                        onChange={(e) =>
                                            setInventoryData((prev) => ({
                                                ...prev,
                                                minStockThreshold:
                                                    e.target.value === ''
                                                        ? 10
                                                        : parseInt(e.target.value) || 10,
                                            }))
                                        }
                                        placeholder="Minimum stock level (default: 10)"
                                        className="border-[#1F1F6F]/20 focus:border-[#1F1F6F]"
                                        data-oid="1m--21:"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex mt-8 pt-6 border-t border-gray-200" data-oid="j2fcso5">
                            <Button
                                onClick={handleAddToInventory}
                                disabled={
                                    !inventoryData.stock ||
                                    !inventoryData.price ||
                                    !inventoryData.expiryDate
                                }
                                className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#1F1F6F] text-white"
                                data-oid="v46bk:7"
                            >
                                Add to Inventory
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}