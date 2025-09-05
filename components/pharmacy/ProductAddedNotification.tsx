'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

interface ProductAddedNotificationProps {
    isVisible: boolean;
    productName: string;
    onClose: () => void;
}

export function ProductAddedNotification({
    isVisible,
    productName,
    onClose,
}: ProductAddedNotificationProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible && !show) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            data-oid="fndok66"
        >
            <div
                className="bg-white rounded-lg shadow-lg border border-[#1F1F6F]/20 p-4 max-w-sm"
                data-oid="c4ty-x5"
            >
                <div className="flex items-start space-x-3" data-oid="iseetkq">
                    <div className="flex-shrink-0" data-oid="ku21jyw">
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center"
                            data-oid="2fcukz6"
                        >
                            <span className="text-white text-sm" data-oid="r-ainwi">
                                ✓
                            </span>
                        </div>
                    </div>
                    <div className="flex-1" data-oid="_o1x6qw">
                        <div className="flex items-center space-x-2 mb-1" data-oid="zbla0gd">
                            <Logo size="sm" data-oid="y9jkmiq" />
                            <span className="text-sm font-medium text-[#1F1F6F]" data-oid="p8lx8ae">
                                Product Added
                            </span>
                        </div>
                        <p className="text-sm text-gray-600" data-oid="lpw17db">
                            <span className="font-medium" data-oid="13hzmys">
                                {productName}
                            </span>{' '}
                            has been successfully added to your inventory.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setShow(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        data-oid=".ja66st"
                    >
                        ×
                    </Button>
                </div>
            </div>
        </div>
    );
}
