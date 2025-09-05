'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryModal } from '@/components/category/CategoryModal';

interface Category {
    id: string;
    name: string;
    count: number;
    type: 'medicine' | 'medical-supply' | 'hygiene-supply' | 'medical-device';
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([
        { id: 'analgesics', name: 'analgesics', count: 45, type: 'medicine' },
        { id: 'antibiotics', name: 'antibiotics', count: 32, type: 'medicine' },
        { id: 'diabetes', name: 'diabetes', count: 28, type: 'medicine' },
        { id: 'hygiene', name: 'hygiene', count: 67, type: 'hygiene-supply' },
        { id: 'medical-supplies', name: 'medical-supplies', count: 89, type: 'medical-supply' },
        { id: 'medical-devices', name: 'medical-devices', count: 34, type: 'medical-device' },
        { id: 'wound-care', name: 'wound-care', count: 23, type: 'medical-supply' },
        { id: 'emergency-care', name: 'emergency-care', count: 19, type: 'medical-supply' },
        { id: 'vitamins', name: 'vitamins', count: 56, type: 'medicine' },
    ]);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        category: Category | null;
    }>({
        isOpen: false,
        mode: 'add',
        category: null,
    });

    const handleAddCategory = () => {
        setModalState({
            isOpen: true,
            mode: 'add',
            category: null,
        });
    };

    const handleEditCategory = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
            setModalState({
                isOpen: true,
                mode: 'edit',
                category,
            });
        }
    };

    const handleViewProducts = (categoryId: string) => {
        // Navigate to products page filtered by category
        router.push(`/database-input/products?category=${categoryId}`);
    };

    const handleModalClose = () => {
        setModalState({
            isOpen: false,
            mode: 'add',
            category: null,
        });
    };

    const handleCategorySave = (categoryData: Omit<Category, 'count'>) => {
        if (modalState.mode === 'add') {
            // Add new category
            const newCategory: Category = {
                ...categoryData,
                count: 0, // New categories start with 0 products
            };
            setCategories((prev) => [...prev, newCategory]);
        } else if (modalState.mode === 'edit' && modalState.category) {
            // Update existing category
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === modalState.category!.id
                        ? { ...cat, name: categoryData.name, type: categoryData.type }
                        : cat,
                ),
            );
        }
    };

    return (
        <>
            <Card data-oid="bl.s3y7">
                <CardHeader data-oid="n-hjyqe">
                    <div className="flex items-center justify-between" data-oid="m4i_607">
                        <CardTitle data-oid="whau:0r">Categories ({categories.length})</CardTitle>
                        <button
                            onClick={handleAddCategory}
                            className="flex items-center px-4 py-2 bg-cura-gradient text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1F1F6F] focus:ring-offset-2"
                            data-oid="4fq.29d"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="-46ronj"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    data-oid="ei6forn"
                                />
                            </svg>
                            Add Category
                        </button>
                    </div>
                </CardHeader>
                <CardContent data-oid="q6uf-xa">
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        data-oid="c._tw0."
                    >
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                data-oid="_o9hh_t"
                            >
                                <div
                                    className="flex items-center justify-between mb-2"
                                    data-oid="s5ehsf5"
                                >
                                    <h3
                                        className="font-semibold text-gray-900 capitalize"
                                        data-oid="h1b6js1"
                                    >
                                        {category.name.replace('-', ' ')}
                                    </h3>
                                    <Badge
                                        className={
                                            category.type === 'medicine'
                                                ? 'bg-red-100 text-red-800'
                                                : category.type === 'medical-supply'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : category.type === 'hygiene-supply'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-purple-100 text-purple-800'
                                        }
                                        data-oid=".-gmlr6"
                                    >
                                        {category.type}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3" data-oid="x0iq4z1">
                                    {category.count} products
                                </p>
                                <div className="flex space-x-2" data-oid="vf5c6r1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditCategory(category.id)}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                                        data-oid="1.mp:69"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewProducts(category.id)}
                                        className="border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white transition-all duration-200"
                                        data-oid="mg:vtnm"
                                    >
                                        View Products
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Category Modal */}
            <CategoryModal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onSave={handleCategorySave}
                category={modalState.category}
                mode={modalState.mode}
                data-oid="-iwve7a"
            />
        </>
    );
}
