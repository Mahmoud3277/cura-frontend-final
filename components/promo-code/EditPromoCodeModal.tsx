'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditPromoCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (promoCodeData: any) => void;
    promoCode: any | null;
}

export function EditPromoCodeModal({ isOpen, onClose, onSubmit, promoCode }: EditPromoCodeModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        discount: '',
    });

    useEffect(() => {
        if (promoCode) {
            setFormData({
                name: promoCode.name || '',
                code: promoCode.code || '',
                discount: promoCode.discount || '',
            });
        } else {
            setFormData({
                name: '',
                code: '',
                discount: '',
            });
        }
    }, [promoCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoCode) {
            onSubmit({
                id: promoCode.id,
                ...formData,
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Promo Code</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Promo Code Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Promo Code</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => handleInputChange('code', e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount Percentage</Label>
                        <Input
                            id="discount"
                            type="number"
                            value={formData.discount}
                            onChange={(e) => handleInputChange('discount', e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Update Promo Code</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
