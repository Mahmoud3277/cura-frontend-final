'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface Category {
    id: string;
    name: string;
    type: 'medicine' | 'medical-supply' | 'hygiene-supply' | 'medical-device';
    count?: number;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: Omit<Category, 'count'>) => void;
    category?: Category | null;
    mode: 'add' | 'edit';
}

export function CategoryModal({ isOpen, onClose, onSave, category, mode }: CategoryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'medicine' as Category['type'],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes or category changes
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && category) {
                setFormData({
                    name: category.name,
                    type: category.type,
                });
            } else {
                setFormData({
                    name: '',
                    type: 'medicine',
                });
            }
            setErrors({});
        }
    }, [isOpen, mode, category]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Category name must be at least 2 characters';
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(formData.name.trim())) {
            newErrors.name = 'Category name can only contain letters, numbers, spaces, and hyphens';
        }

        if (!formData.type) {
            newErrors.type = 'Category type is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const categoryData = {
                id:
                    mode === 'edit' && category
                        ? category.id
                        : formData.name.toLowerCase().replace(/\s+/g, '-'),
                name: formData.name.trim(),
                type: formData.type,
            };

            onSave(categoryData);
            onClose();
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} data-oid="omfbr5l">
            <DialogContent className="sm:max-w-md" data-oid="n4zhtan">
                <DialogHeader data-oid="x-bmfal">
                    <DialogTitle className="flex items-center space-x-2" data-oid="lo7wum3">
                        <div
                            className="w-8 h-8 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                            data-oid="f-ygs3i"
                        >
                            <svg
                                className="w-5 h-5 text-[#1F1F6F]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="nmus:hc"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                        mode === 'add'
                                            ? 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                                            : 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                    }
                                    data-oid="m_-ty60"
                                />
                            </svg>
                        </div>
                        <span data-oid="cq7adai">
                            {mode === 'add' ? 'Add New Category' : 'Edit Category'}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4" data-oid="6:s-cek">
                    {/* Category Name */}
                    <div className="space-y-2" data-oid="h-h9_kb">
                        <Label htmlFor="category-name" data-oid="o2dtzg0">
                            Category Name
                        </Label>
                        <Input
                            id="category-name"
                            type="text"
                            placeholder="Enter category name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                            disabled={isSubmitting}
                            data-oid="qa_ss09"
                        />

                        {errors.name && (
                            <p className="text-sm text-red-600" data-oid=".8_zspc">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Category Type */}
                    <div className="space-y-2" data-oid="x97_giv">
                        <Label htmlFor="category-type" data-oid="hkgpv85">
                            Category Type
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) =>
                                setFormData({ ...formData, type: value as Category['type'] })
                            }
                            disabled={isSubmitting}
                            data-oid="52hrc8w"
                        >
                            <SelectTrigger
                                className={errors.type ? 'border-red-500 focus:border-red-500' : ''}
                                data-oid="viahi67"
                            >
                                <SelectValue
                                    placeholder="Select category type"
                                    data-oid="4j.leyb"
                                />
                            </SelectTrigger>
                            <SelectContent data-oid="ek3bvkg">
                                <SelectItem value="medicine" data-oid="9godbh3">
                                    <div className="flex items-center space-x-2" data-oid="1nao0g3">
                                        <div
                                            className="w-3 h-3 bg-red-500 rounded-full"
                                            data-oid="4ylgy_8"
                                        ></div>
                                        <span data-oid="nj6eips">Medicine</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="medical-supply" data-oid="2jt3769">
                                    <div className="flex items-center space-x-2" data-oid="d-2k-70">
                                        <div
                                            className="w-3 h-3 bg-blue-500 rounded-full"
                                            data-oid="6:0o89h"
                                        ></div>
                                        <span data-oid="546g5dv">Medical Supply</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="hygiene-supply" data-oid="pq:zlik">
                                    <div className="flex items-center space-x-2" data-oid=":qp.we2">
                                        <div
                                            className="w-3 h-3 bg-green-500 rounded-full"
                                            data-oid="fx2esgw"
                                        ></div>
                                        <span data-oid="2vp6oza">Hygiene Supply</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="medical-device" data-oid="cwby4yr">
                                    <div className="flex items-center space-x-2" data-oid="6b0o8ai">
                                        <div
                                            className="w-3 h-3 bg-purple-500 rounded-full"
                                            data-oid="k5h8vqt"
                                        ></div>
                                        <span data-oid="q.ldv:u">Medical Device</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-red-600" data-oid="3hfv744">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    {/* Category Preview */}
                    {formData.name && (
                        <div className="p-3 bg-gray-50 rounded-lg border" data-oid="13u68gj">
                            <Label className="text-sm font-medium text-gray-700" data-oid="1fyje0h">
                                Preview:
                            </Label>
                            <div className="mt-2 flex items-center space-x-2" data-oid="0o:hq_x">
                                <span className="font-medium capitalize" data-oid="byd-jya">
                                    {formData.name.replace(/-/g, ' ')}
                                </span>
                                <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        formData.type === 'medicine'
                                            ? 'bg-red-100 text-red-800'
                                            : formData.type === 'medical-supply'
                                              ? 'bg-blue-100 text-blue-800'
                                              : formData.type === 'hygiene-supply'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-purple-100 text-purple-800'
                                    }`}
                                    data-oid="ry.hf:r"
                                >
                                    {formData.type.replace('-', ' ')}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex space-x-2" data-oid=".wglys:">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            data-oid="db5_mmp"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#1F1F6F] text-white hover:bg-[#14274E]"
                            data-oid="s7vd.-k"
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                        data-oid="seree._"
                                    />

                                    {mode === 'add' ? 'Adding...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid=".7uwflu"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                            data-oid="jomgrba"
                                        />
                                    </svg>
                                    {mode === 'add' ? 'Add Category' : 'Save Changes'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
