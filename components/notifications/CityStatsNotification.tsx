'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Building2, Stethoscope, Package, X } from 'lucide-react';

interface CityStatsUpdate {
    cityName: string;
    updateType: 'pharmacy' | 'doctor' | 'vendor' | 'customer';
    action: 'added' | 'removed' | 'activated' | 'deactivated';
    timestamp: string;
    newCount: number;
}

interface CityStatsNotificationProps {
    updates: CityStatsUpdate[];
    onDismiss: (index: number) => void;
    onDismissAll: () => void;
}

export function CityStatsNotification({
    updates,
    onDismiss,
    onDismissAll,
}: CityStatsNotificationProps) {
    if (updates.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'pharmacy':
                return <Building2 className="w-4 h-4" data-oid="s4f2i.u" />;
            case 'doctor':
                return <Stethoscope className="w-4 h-4" data-oid="y1jpedx" />;
            case 'vendor':
                return <Package className="w-4 h-4" data-oid="wqjqtya" />;
            case 'customer':
                return <Users className="w-4 h-4" data-oid="j4i9l0a" />;
            default:
                return <MapPin className="w-4 h-4" data-oid="vmub4zp" />;
        }
    };

    const getColor = (action: string) => {
        switch (action) {
            case 'added':
            case 'activated':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'removed':
            case 'deactivated':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm" data-oid="2nya.x.">
            <div className="flex justify-between items-center mb-2" data-oid="enzqge3">
                <h3 className="text-sm font-semibold text-gray-700" data-oid="dp5c2vy">
                    City Updates
                </h3>
                {updates.length > 1 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDismissAll}
                        className="text-xs"
                        data-oid="7fod0b9"
                    >
                        Dismiss All
                    </Button>
                )}
            </div>

            {updates.slice(0, 5).map((update, index) => (
                <Card
                    key={index}
                    className="shadow-lg border-l-4 border-l-blue-500"
                    data-oid="a_94s2_"
                >
                    <CardContent className="p-3" data-oid="dvk953y">
                        <div className="flex items-start justify-between" data-oid="efrf4dw">
                            <div className="flex items-start space-x-2" data-oid="j26y-i3">
                                <div className="mt-0.5" data-oid="jtj-kzs">
                                    {getIcon(update.updateType)}
                                </div>
                                <div className="flex-1" data-oid="c2wbag_">
                                    <div
                                        className="flex items-center space-x-2 mb-1"
                                        data-oid="qope6p2"
                                    >
                                        <span className="font-medium text-sm" data-oid="6myhx6j">
                                            {update.cityName}
                                        </span>
                                        <Badge
                                            className={`text-xs ${getColor(update.action)}`}
                                            data-oid="_3l08d7"
                                        >
                                            {update.action}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600" data-oid="p0k.s-5">
                                        {update.updateType} {update.action} • Total:{' '}
                                        {update.newCount}
                                    </p>
                                    <p className="text-xs text-gray-400" data-oid="e13:8yv">
                                        {new Date(update.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDismiss(index)}
                                className="h-6 w-6 p-0"
                                data-oid="9zmhxz8"
                            >
                                <X className="w-3 h-3" data-oid="ksf-d2a" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {updates.length > 5 && (
                <Card className="shadow-lg" data-oid="tt4_dhc">
                    <CardContent className="p-2 text-center" data-oid="6k_r6oz">
                        <p className="text-xs text-gray-500" data-oid="-nnr68g">
                            +{updates.length - 5} more updates
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
