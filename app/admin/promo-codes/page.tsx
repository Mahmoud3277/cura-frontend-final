'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Download,
    Ticket,
} from 'lucide-react';

import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EditPromoCodeModal } from '@/components/promo-code/EditPromoCodeModal';
import { PromoCode } from '@/lib/types';
import Cookies from 'js-cookie';

import * as XLSX from 'xlsx';

export default function AdminPromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedCodeForDelete, setSelectedCodeForDelete] = useState<PromoCode | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCodeForEdit, setSelectedCodeForEdit] = useState<PromoCode | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [newPromoCode, setNewPromoCode] = useState({
        name: '',
        discount: '',
        minimumOrder: '',
    });

    useEffect(() => {
        loadPromoCodes();
    }, []);

    const loadPromoCodes = async () => {
        try {
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo-codes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Map backend fields to frontend format
                    const mappedCodes = data.data.map((code: any) => ({
                        id: code._id,
                        name: code.name,
                        code: code.name, // Backend uses 'name' as the code
                        discount: code.discount,
                        status: code.enabled ? 'active' : 'expired',
                        redemptions: code.usageCount,
                        minOrderAmount: code.minimumOrder,
                        maxDiscount: 0,
                        description: `${code.discount}% off your order`
                    }));
                    setPromoCodes(mappedCodes);
                }
            }
        } catch (error) {
            console.error('Error loading promo codes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPromoCode((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPromoCode = async () => {
        if (!newPromoCode.name || !newPromoCode.discount || !newPromoCode.minimumOrder) {
            alert('Please fill all fields');
            return;
        }

        setIsCreating(true);
        try {
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo-codes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newPromoCode.name.toUpperCase(),
                    discount: parseInt(newPromoCode.discount, 10),
                    minimumOrder: parseInt(newPromoCode.minimumOrder, 10),
                    enabled: true
                })
            });

            const data = await response.json();
            if (data.success) {
                await loadPromoCodes(); // Reload the list
                setNewPromoCode({ name: '', discount: '', minimumOrder: '' });
                alert('Promo code created successfully!');
            } else {
                alert(data.error || 'Failed to create promo code');
            }
        } catch (error) {
            console.error('Error creating promo code:', error);
            alert('Failed to create promo code');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteClick = (code: PromoCode) => {
        setSelectedCodeForDelete(code);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCodeForDelete) return;

        try {
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo-codes/${selectedCodeForDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                await loadPromoCodes(); // Reload the list
                alert('Promo code deleted successfully!');
            } else {
                alert(data.error || 'Failed to delete promo code');
            }
        } catch (error) {
            console.error('Error deleting promo code:', error);
            alert('Failed to delete promo code');
        }

        setShowDeleteConfirm(false);
        setSelectedCodeForDelete(null);
    };

    const handleEditClick = (code: PromoCode) => {
        setSelectedCodeForEdit(code);
        setShowEditModal(true);
    };

    const handleUpdatePromoCode = async (updatedCode: PromoCode) => {
        try {
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo-codes/${updatedCode.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedCode.code.toUpperCase(),
                    discount: updatedCode.discount,
                    minimumOrder: updatedCode.minOrderAmount,
                    enabled: updatedCode.status === 'active'
                })
            });

            const data = await response.json();
            if (data.success) {
                await loadPromoCodes(); // Reload the list
                alert('Promo code updated successfully!');
            } else {
                alert(data.error || 'Failed to update promo code');
            }
        } catch (error) {
            console.error('Error updating promo code:', error);
            alert('Failed to update promo code');
        }

        setShowEditModal(false);
        setSelectedCodeForEdit(null);
    };

    const exportData = () => {
        const dataToExport = promoCodes.map((code) => ({
            Name: code.name,
            Code: code.code,
            Discount: code.discount,
            Status: code.status,
            Redemptions: code.redemptions,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Promo Codes");

        XLSX.writeFile(workbook, "promo-codes-data.xlsx");
    };

    const handleTogglePromoCodeStatus = async (codeId: string) => {
        const code = promoCodes.find(c => c.id === codeId);
        if (!code) return;

        try {
            const token = Cookies.get('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo-codes/${codeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    enabled: code.status !== 'active'
                })
            });

            const data = await response.json();
            if (data.success) {
                await loadPromoCodes(); // Reload the list
            } else {
                alert(data.error || 'Failed to update promo code status');
            }
        } catch (error) {
            console.error('Error updating promo code status:', error);
            alert('Failed to update promo code status');
        }
    };

    const filteredPromoCodes = promoCodes.filter(
        (code) =>
            code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Promo Code Management</h1>
                        <p className="text-sm text-gray-600">
                            Create and manage discount codes for your customers.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" onClick={exportData}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add Promo Code Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Create New Promo Code</CardTitle>
                    <CardDescription>
                        Add a new promo code to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            name="name"
                            placeholder="Promo Code (e.g., SUMMER20)"
                            value={newPromoCode.name}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="discount"
                            type="number"
                            placeholder="Discount Percentage (e.g., 20)"
                            value={newPromoCode.discount}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="minimumOrder"
                            type="number"
                            placeholder="Minimum Order (e.g., 100)"
                            value={newPromoCode.minimumOrder}
                            onChange={handleInputChange}
                        />
                        <Button onClick={handleAddPromoCode} disabled={isCreating}>
                            <Plus className="w-4 h-4 mr-2" />
                            {isCreating ? 'Creating...' : 'Add Promo Code'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Promo Codes List */}
            <Card>
                <CardHeader>
                    <CardTitle>Existing Promo Codes</CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredPromoCodes.map((code) => (
                            <div
                                key={code.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-cura-primary-light flex items-center justify-center">
                                        <Ticket className="w-5 h-5 text-cura-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{code.name}</h3>
                                        <p className="text-sm text-gray-500">Code: {code.code}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                        <p className="font-semibold text-lg text-cura-primary">{code.discount}%</p>
                                        <p className="text-xs text-gray-500">Discount</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-lg">{code.redemptions}</p>
                                        <p className="text-xs text-gray-500">Redemptions</p>
                                    </div>
                                    <div>
                                        <Switch
                                            checked={code.status === 'active'}
                                            onCheckedChange={() => handleTogglePromoCodeStatus(code.id)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditClick(code)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteClick(code)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPromoCodes.length === 0 && (
                        <div className="text-center py-8">
                            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No promo codes found
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Create a new promo code to get started'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Promo Code"
                description={`Are you sure you want to delete the promo code "${selectedCodeForDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="destructive"
            />

            <EditPromoCodeModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdatePromoCode}
                promoCode={selectedCodeForEdit}
            />
        </div>
    );
}
