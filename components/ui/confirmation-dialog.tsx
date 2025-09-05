'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, Settings } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'warning' | 'success';
    isLoading?: boolean;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false,
}: ConfirmationDialogProps) {
    const getIcon = () => {
        switch (variant) {
            case 'destructive':
                return <AlertTriangle className="w-5 h-5 text-red-600" data-oid="7zahgy9" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" data-oid="i8fyv.4" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" data-oid="aygt7-r" />;
            default:
                return <Settings className="w-5 h-5 text-blue-600" data-oid="_hgreld" />;
        }
    };

    const getIconBgColor = () => {
        switch (variant) {
            case 'destructive':
                return 'bg-red-100';
            case 'warning':
                return 'bg-yellow-100';
            case 'success':
                return 'bg-green-100';
            default:
                return 'bg-blue-100';
        }
    };

    const getConfirmButtonVariant = () => {
        switch (variant) {
            case 'destructive':
                return 'destructive';
            case 'warning':
                return 'default';
            case 'success':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="fx9pq94">
            <DialogContent className="sm:max-w-md" data-oid="guritwn">
                <DialogHeader data-oid="kvt6ltd">
                    <div className="flex items-center space-x-3" data-oid="6p-5j8v">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBgColor()}`}
                            data-oid="z55a3wm"
                        >
                            {getIcon()}
                        </div>
                        <div data-oid="oc.ca0a">
                            <DialogTitle
                                className="text-lg font-semibold text-gray-900"
                                data-oid="a7c_6p8"
                            >
                                {title}
                            </DialogTitle>
                            <DialogDescription
                                className="text-sm text-gray-500 mt-1"
                                data-oid="yw4:x1u"
                            >
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex space-x-2 mt-6" data-oid="79vx.o1">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        data-oid="2.6ps.i"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={getConfirmButtonVariant()}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={
                            variant === 'default' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                        }
                        data-oid="y.9lknr"
                    >
                        {isLoading ? (
                            <>
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                    data-oid=":5a8ti_"
                                />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
