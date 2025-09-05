'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { governorates } from '@/lib/data/governorates';
import { CityWithStatus } from '@/lib/services/cityManagementService';

interface EditCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (cityData: any) => void;
    city: CityWithStatus | null;
}

export function EditCityModal({ isOpen, onClose, onSubmit, city }: EditCityModalProps) {
    console.log('EditCityModal rendered with:', { isOpen, city });

    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        governorateId: '',
        pharmacyCount: 0,
        doctorCount: 0,
    });

    useEffect(() => {
        if (city) {
            setFormData({
                nameEn: city.nameEn || '',
                nameAr: city.nameAr || '',
                governorateId: city.governorateId || '',
                pharmacyCount: city.pharmacyCount || 0,
                doctorCount: city.doctorCount || 0,
            });
        } else {
            // Reset form when no city is selected
            setFormData({
                nameEn: '',
                nameAr: '',
                governorateId: '',
                pharmacyCount: 0,
                doctorCount: 0,
            });
        }
    }, [city]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.nameEn.trim() || !formData.nameAr.trim() || !formData.governorateId) {
            console.error('Please fill in all required fields');
            return;
        }

        if (city) {
            onSubmit({
                id: city.id,
                ...formData,
                nameEn: formData.nameEn.trim(),
                nameAr: formData.nameAr.trim(),
            });
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="uklfd5t">
            <DialogContent className="sm:max-w-[500px]" data-oid="z0_l3cg">
                <DialogHeader data-oid="auv3wuj">
                    <DialogTitle data-oid="g4blymn">Edit City</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4" data-oid="gz1iy_o">
                    <div className="grid grid-cols-2 gap-4" data-oid="uy26la:">
                        <div data-oid="_aicq-n">
                            <Label htmlFor="nameEn" data-oid="ou97pnu">
                                City Name (English)
                            </Label>
                            <Input
                                id="nameEn"
                                value={formData.nameEn}
                                onChange={(e) => handleInputChange('nameEn', e.target.value)}
                                required
                                data-oid="p7s:5iv"
                            />
                        </div>
                        <div data-oid="_ru7p4s">
                            <Label htmlFor="nameAr" data-oid="ty-3udl">
                                City Name (Arabic)
                            </Label>
                            <Input
                                id="nameAr"
                                value={formData.nameAr}
                                onChange={(e) => handleInputChange('nameAr', e.target.value)}
                                required
                                data-oid="qdfry72"
                            />
                        </div>
                    </div>

                    <div data-oid="xf6dq3_">
                        <Label htmlFor="governorate" data-oid="72mmqpp">
                            Governorate
                        </Label>
                        <Select
                            value={formData.governorateId}
                            onValueChange={(value) => handleInputChange('governorateId', value)}
                            data-oid="ks8_0av"
                        >
                            <SelectTrigger data-oid="mnxe6nb">
                                <SelectValue placeholder="Select governorate" data-oid="mol_dl-" />
                            </SelectTrigger>
                            <SelectContent data-oid="n3sf-z-">
                                {governorates.map((gov) => (
                                    <SelectItem key={gov.id} value={gov.id} data-oid="iejb.g2">
                                        {gov.nameEn}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4" data-oid="q5nwo89">
                        <div data-oid="-70eb.v">
                            <Label htmlFor="pharmacyCount" data-oid="746fvf5">
                                Pharmacy Count
                            </Label>
                            <Input
                                id="pharmacyCount"
                                type="number"
                                value={formData.pharmacyCount}
                                onChange={(e) =>
                                    handleInputChange(
                                        'pharmacyCount',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                min="0"
                                data-oid="6b-eebf"
                            />
                        </div>
                        <div data-oid="acwammn">
                            <Label htmlFor="doctorCount" data-oid="6khb-kd">
                                Doctor Count
                            </Label>
                            <Input
                                id="doctorCount"
                                type="number"
                                value={formData.doctorCount}
                                onChange={(e) =>
                                    handleInputChange('doctorCount', parseInt(e.target.value) || 0)
                                }
                                min="0"
                                data-oid="6a2q8ff"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4" data-oid="8r0ddce">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            data-oid="zb-0kx8"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" data-oid="zzxgbg1">
                            Update City
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
