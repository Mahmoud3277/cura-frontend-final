'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { governorates } from '@/lib/data/governorates';
import { getCitiesByGovernorate } from '@/lib/data/cities';

interface AddDistrictModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (districtData: {
        nameEn: string;
        nameAr: string;
        cityId: string;
        governorateId: string;
        coordinates: { lat: number; lng: number };
        description?: string;
        estimatedPopulation: number;
    }) => void;
}

export default function AddDistrictModal({ isOpen, onClose, onSubmit }: AddDistrictModalProps) {
    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        governorateId: '',
        cityId: '',
        lat: 0,
        lng: 0,
        description: '',
        estimatedPopulation: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [availableCities, setAvailableCities] = useState<any[]>([]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nameEn.trim()) {
            newErrors.nameEn = 'English name is required';
        }
        if (!formData.nameAr.trim()) {
            newErrors.nameAr = 'Arabic name is required';
        }
        if (!formData.governorateId) {
            newErrors.governorateId = 'Governorate is required';
        }
        if (!formData.cityId) {
            newErrors.cityId = 'City is required';
        }
        if (formData.lat === 0 || formData.lng === 0) {
            newErrors.coordinates = 'Valid coordinates are required';
        }
        if (formData.estimatedPopulation < 0) {
            newErrors.estimatedPopulation = 'Population must be positive';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                nameEn: formData.nameEn,
                nameAr: formData.nameAr,
                cityId: formData.cityId,
                governorateId: formData.governorateId,
                coordinates: { lat: formData.lat, lng: formData.lng },
                description: formData.description,
                estimatedPopulation: formData.estimatedPopulation,
            });

            // Reset form
            setFormData({
                nameEn: '',
                nameAr: '',
                governorateId: '',
                cityId: '',
                lat: 0,
                lng: 0,
                description: '',
                estimatedPopulation: 0,
            });
            setErrors({});
            setAvailableCities([]);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleGovernorateChange = (governorateId: string) => {
        setFormData((prev) => ({ ...prev, governorateId, cityId: '' }));
        const cities = getCitiesByGovernorate(governorateId);
        setAvailableCities(cities);
        if (errors.governorateId) {
            setErrors((prev) => ({ ...prev, governorateId: '' }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="x..n2wh">
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-oid="7mdcgod">
                <DialogHeader data-oid="x6y_8g5">
                    <DialogTitle data-oid="m5.pg42">Add New District</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4" data-oid="nxrlhly">
                    {/* English Name */}
                    <div data-oid="55c:-:e">
                        <Label htmlFor="nameEn" data-oid="rl5qm7v">
                            District Name (English) *
                        </Label>
                        <Input
                            id="nameEn"
                            type="text"
                            value={formData.nameEn}
                            onChange={(e) => handleInputChange('nameEn', e.target.value)}
                            className={errors.nameEn ? 'border-red-300' : ''}
                            placeholder="e.g., Maadi District"
                            data-oid="gem-9cq"
                        />

                        {errors.nameEn && (
                            <p className="text-red-500 text-sm mt-1" data-oid="dfi93dd">
                                {errors.nameEn}
                            </p>
                        )}
                    </div>

                    {/* Arabic Name */}
                    <div data-oid=".0.-06v">
                        <Label htmlFor="nameAr" data-oid="rd3:cxn">
                            District Name (Arabic) *
                        </Label>
                        <Input
                            id="nameAr"
                            type="text"
                            value={formData.nameAr}
                            onChange={(e) => handleInputChange('nameAr', e.target.value)}
                            className={errors.nameAr ? 'border-red-300' : ''}
                            placeholder="مثال: حي المعادي"
                            dir="rtl"
                            data-oid=".866qot"
                        />

                        {errors.nameAr && (
                            <p className="text-red-500 text-sm mt-1" data-oid="-pa5_92">
                                {errors.nameAr}
                            </p>
                        )}
                    </div>

                    {/* Governorate */}
                    <div data-oid="40o6o7j">
                        <Label htmlFor="governorate" data-oid="b-cqem4">
                            Governorate *
                        </Label>
                        <Select
                            value={formData.governorateId}
                            onValueChange={handleGovernorateChange}
                            data-oid="5k20qcq"
                        >
                            <SelectTrigger
                                className={errors.governorateId ? 'border-red-300' : ''}
                                data-oid="jdv9aje"
                            >
                                <SelectValue placeholder="Select Governorate" data-oid=":lgx8ou" />
                            </SelectTrigger>
                            <SelectContent data-oid="imwv695">
                                {governorates.map((gov) => (
                                    <SelectItem key={gov.id} value={gov.id} data-oid="ntjn7n8">
                                        {gov.nameEn} ({gov.nameAr})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.governorateId && (
                            <p className="text-red-500 text-sm mt-1" data-oid="-kl4qmm">
                                {errors.governorateId}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div data-oid="07a_hc1">
                        <Label htmlFor="city" data-oid="6fj.k:0">
                            City *
                        </Label>
                        <Select
                            value={formData.cityId}
                            onValueChange={(value) => handleInputChange('cityId', value)}
                            disabled={!formData.governorateId}
                            data-oid="284i.mc"
                        >
                            <SelectTrigger
                                className={errors.cityId ? 'border-red-300' : ''}
                                data-oid="lbj__43"
                            >
                                <SelectValue placeholder="Select City" data-oid="hnl1r6k" />
                            </SelectTrigger>
                            <SelectContent data-oid="l3x5rph">
                                {availableCities.map((city) => (
                                    <SelectItem key={city.id} value={city.id} data-oid="00svij_">
                                        {city.nameEn} ({city.nameAr})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.cityId && (
                            <p className="text-red-500 text-sm mt-1" data-oid="qb5e7mb">
                                {errors.cityId}
                            </p>
                        )}
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4" data-oid="vj2ggz_">
                        <div data-oid="rgmnv2-">
                            <Label htmlFor="lat" data-oid="ke-1.2t">
                                Latitude *
                            </Label>
                            <Input
                                id="lat"
                                type="number"
                                step="any"
                                value={formData.lat}
                                onChange={(e) =>
                                    handleInputChange('lat', parseFloat(e.target.value) || 0)
                                }
                                className={errors.coordinates ? 'border-red-300' : ''}
                                placeholder="30.0444"
                                data-oid="r5qeoux"
                            />
                        </div>
                        <div data-oid="v582h-9">
                            <Label htmlFor="lng" data-oid="plyfiiu">
                                Longitude *
                            </Label>
                            <Input
                                id="lng"
                                type="number"
                                step="any"
                                value={formData.lng}
                                onChange={(e) =>
                                    handleInputChange('lng', parseFloat(e.target.value) || 0)
                                }
                                className={errors.coordinates ? 'border-red-300' : ''}
                                placeholder="31.2357"
                                data-oid="_mc9w.n"
                            />
                        </div>
                        {errors.coordinates && (
                            <p className="text-red-500 text-sm mt-1 col-span-2" data-oid="x.n2g:h">
                                {errors.coordinates}
                            </p>
                        )}
                    </div>

                    {/* Estimated Population */}
                    <div data-oid="488sxj4">
                        <Label htmlFor="population" data-oid="p16a_83">
                            Estimated Population
                        </Label>
                        <Input
                            id="population"
                            type="number"
                            min="0"
                            value={formData.estimatedPopulation}
                            onChange={(e) =>
                                handleInputChange(
                                    'estimatedPopulation',
                                    parseInt(e.target.value) || 0,
                                )
                            }
                            className={errors.estimatedPopulation ? 'border-red-300' : ''}
                            placeholder="50000"
                            data-oid="7iitr6u"
                        />

                        {errors.estimatedPopulation && (
                            <p className="text-red-500 text-sm mt-1" data-oid="nc.xz4y">
                                {errors.estimatedPopulation}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div data-oid="6349277">
                        <Label htmlFor="description" data-oid="2e2h1xx">
                            Description (Optional)
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Brief description of the district..."
                            rows={3}
                            data-oid="6iyl.n8"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4" data-oid="4z.rq18">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            data-oid="6js27q3"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" data-oid="hk88pf1">
                            Add District
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
