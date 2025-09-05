'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { CityWithStatus } from '@/lib/services/cityManagementService';

interface DeleteCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    city: CityWithStatus | null;
    isLoading?: boolean;
}

export function DeleteCityModal({
    isOpen,
    onClose,
    onConfirm,
    city,
    isLoading = false,
}: DeleteCityModalProps) {
    const [confirmationText, setConfirmationText] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const expectedText = city ? `DELETE ${city.nameEn.toUpperCase()}` : '';

    const handleConfirmationChange = (value: string) => {
        setConfirmationText(value);
        setIsConfirmed(value === expectedText);
    };

    const handleConfirm = () => {
        if (isConfirmed) {
            onConfirm();
            handleClose();
        }
    };

    const handleClose = () => {
        setConfirmationText('');
        setIsConfirmed(false);
        onClose();
    };

    if (!city) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} data-oid="fnyree-">
            <DialogContent className="sm:max-w-md" data-oid="z-4jbeu">
                <DialogHeader data-oid=".tjxjn1">
                    <div className="flex items-center space-x-2" data-oid="huql33j">
                        <div
                            className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
                            data-oid="rd05sqd"
                        >
                            <AlertTriangle className="w-5 h-5 text-red-600" data-oid="nuyqjw8" />
                        </div>
                        <div data-oid="pz4w-85">
                            <DialogTitle
                                className="text-lg font-semibold text-gray-900"
                                data-oid="f266uyz"
                            >
                                Delete City
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500" data-oid="b9vj.9r">
                                This action cannot be undone
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4" data-oid="3kwwt:e">
                    <div
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                        data-oid="pi5ciun"
                    >
                        <div className="flex items-start space-x-3" data-oid="vzoe_ts">
                            <Trash2 className="w-5 h-5 text-red-600 mt-0.5" data-oid="m03ok1p" />
                            <div data-oid=".4v8lrs">
                                <h4 className="font-medium text-red-800" data-oid="xvmfcek">
                                    You are about to delete {'"'}{city.nameEn}{'"'}
                                </h4>
                                <p className="text-sm text-red-700 mt-1" data-oid="n43kf9z">
                                    This will permanently remove the city from the system. All
                                    associated data will be lost.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2" data-oid="p771n4f">
                        <Label
                            htmlFor="confirmation"
                            className="text-sm font-medium"
                            data-oid=":d4ste7"
                        >
                            Type{' '}
                            <span className="font-mono bg-gray-100 px-1 rounded" data-oid="auk9-dh">
                                {expectedText}
                            </span>{' '}
                            to confirm:
                        </Label>
                        <Input
                            id="confirmation"
                            value={confirmationText}
                            onChange={(e) => handleConfirmationChange(e.target.value)}
                            placeholder={expectedText}
                            className="font-mono"
                            disabled={isLoading}
                            data-oid="5qtybf1"
                        />
                    </div>

                    {city.isDefault && (
                        <div
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                            data-oid="tcrvtvm"
                        >
                            <p className="text-sm text-yellow-800" data-oid="w84xj64">
                                <strong data-oid="9mzv7qk">Note:</strong> This city is currently set
                                as the default city. You cannot delete it until you set another city
                                as default.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex space-x-2" data-oid="l4tp65.">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        data-oid="_i1:1d3"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!isConfirmed || isLoading || city.isDefault}
                        className="bg-red-600 hover:bg-red-700"
                        data-oid=":0o_hh:"
                    >
                        {isLoading ? (
                            <>
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                    data-oid="-v0sl:k"
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" data-oid="x-2rxb7" />
                                Delete City
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
