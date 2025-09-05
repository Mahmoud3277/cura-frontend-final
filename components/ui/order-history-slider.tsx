'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Calendar,
    Package,
    DollarSign,
    ShoppingBag,
    Clock,
    ChevronDown,
    ChevronUp,
    Pill,
    Heart,
    Baby,
    Sparkles,
    Shield,
} from 'lucide-react';

interface OrderItem {
    product: string;
    quantity: number;
    price: number;
}

interface OrderHistory {
    orderDate: string;
    orderId: string;
    items: OrderItem[];
    totalAmount: number;
    reason: string;
}

interface OrderHistorySliderProps {
    orders: OrderHistory[];
    className?: string;
}

// Helper function to get product category icon
const getProductIcon = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('baby') || name.includes('formula') || name.includes('diaper')) {
        return <Baby className="h-4 w-4 text-pink-500" data-oid="2xboi0:" />;
    } else if (name.includes('vitamin') || name.includes('supplement') || name.includes('omega')) {
        return <Sparkles className="h-4 w-4 text-amber-500" data-oid="g6euz9m" />;
    } else if (name.includes('cream') || name.includes('serum') || name.includes('skincare')) {
        return <Heart className="h-4 w-4 text-rose-500" data-oid="eycjujj" />;
    } else if (
        name.includes('insulin') ||
        name.includes('metformin') ||
        name.includes('medication')
    ) {
        return <Shield className="h-4 w-4 text-red-500" data-oid="ltcw.fk" />;
    } else {
        return <Pill className="h-4 w-4 text-cura-primary" data-oid="f5ujc_b" />;
    }
};

// Helper function to get order status color
const getOrderStatusColor = (index: number, total: number) => {
    if (index === 0) return 'bg-green-100 text-green-800 border-green-200';
    if (index < 3) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
};

export function OrderHistorySlider({ orders, className = '' }: OrderHistorySliderProps) {
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set([0])); // First order expanded by default

    const toggleOrderExpansion = (index: number) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedOrders(newExpanded);
    };

    if (orders.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`} data-oid="27c7zix">
                <div
                    className="p-4 bg-cura-primary/5 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    data-oid="htygcbf"
                >
                    <ShoppingBag className="h-8 w-8 text-cura-primary/60" data-oid="_ord:ki" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="gbqlodu">
                    No Order History
                </h3>
                <p className="text-gray-500" data-oid="oesez5i">
                    No orders have been placed yet.
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`} data-oid="p0-dcb-">
            {/* Enhanced Header with CURA Branding */}
            <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 rounded-xl border border-cura-primary/10"
                data-oid="bu3z2nv"
            >
                <div className="flex items-center space-x-3" data-oid="3x2rjmo">
                    <div className="p-2 bg-cura-primary/10 rounded-lg" data-oid="m_6.-0t">
                        <Calendar className="h-5 w-5 text-cura-primary" data-oid="44qukfy" />
                    </div>
                    <div data-oid="b482nyg">
                        <h3 className="text-lg font-semibold text-cura-primary" data-oid=":kak.69">
                            Complete Order History
                        </h3>
                        <p className="text-sm text-cura-primary/70" data-oid="00s05_t">
                            Showing all {orders.length} orders
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className="bg-cura-primary/10 text-cura-primary border-cura-primary/30 font-semibold"
                    data-oid="nwfp1sp"
                >
                    {orders.length} Orders
                </Badge>
            </div>

            {/* Enhanced Orders List */}
            <ScrollArea className="h-[600px] w-full" data-oid="eundech">
                <div className="space-y-4 pr-4" data-oid="36gr-ct">
                    {orders.map((order, index) => {
                        const isExpanded = expandedOrders.has(index);
                        const orderDate = new Date(order.orderDate);
                        const isRecent = index < 3;

                        return (
                            <Card
                                key={`${order.orderId}-${index}`}
                                className={`transition-all duration-300 hover:shadow-lg border-l-4 ${
                                    isRecent
                                        ? 'border-l-cura-primary bg-gradient-to-r from-cura-primary/5 to-transparent'
                                        : 'border-l-gray-300'
                                }`}
                                data-oid="gmhoogm"
                            >
                                <CardHeader className="pb-3" data-oid="2qkhxu4">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="ogn70pm"
                                    >
                                        <div
                                            className="flex items-center space-x-4"
                                            data-oid="56:64rv"
                                        >
                                            <div
                                                className={`p-3 rounded-xl ${
                                                    isRecent
                                                        ? 'bg-cura-primary text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                                data-oid="jqczwwd"
                                            >
                                                <Package className="h-5 w-5" data-oid="4gn:dvm" />
                                            </div>
                                            <div data-oid="qgb7q75">
                                                <CardTitle
                                                    className="text-lg font-semibold text-gray-900"
                                                    data-oid="0w44shm"
                                                >
                                                    {orderDate.toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </CardTitle>
                                                <div
                                                    className="flex items-center space-x-3 mt-1"
                                                    data-oid="nv0e857"
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200"
                                                        data-oid="3cis8m4"
                                                    >
                                                        {order.orderId}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getOrderStatusColor(index, orders.length)}`}
                                                        data-oid=".l7:-u2"
                                                    >
                                                        {index === 0
                                                            ? 'Latest'
                                                            : `${index + 1} orders ago`}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center space-x-4"
                                            data-oid="afkc931"
                                        >
                                            <div className="text-right" data-oid="raemva9">
                                                <div
                                                    className="text-2xl font-bold text-cura-primary"
                                                    data-oid="58xztyn"
                                                >
                                                    EGP {order.totalAmount.toFixed(2)}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-500 flex items-center"
                                                    data-oid="frbzqzj"
                                                >
                                                    <ShoppingBag
                                                        className="h-3 w-3 mr-1"
                                                        data-oid="uutxm_n"
                                                    />
                                                    {order.items.length} item
                                                    {order.items.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleOrderExpansion(index)}
                                                className="h-8 w-8 p-0 hover:bg-cura-primary/10"
                                                data-oid="1ex:mqm"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp
                                                        className="h-4 w-4 text-cura-primary"
                                                        data-oid="-qrre_f"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        className="h-4 w-4 text-cura-primary"
                                                        data-oid="jlip:jb"
                                                    />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="pt-0" data-oid="e:fjy1-">
                                        <Separator className="mb-4" data-oid="pm3o2r1" />

                                        {/* Order Reason */}
                                        {order.reason && (
                                            <div
                                                className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                                                data-oid="804nugi"
                                            >
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="pbtozmd"
                                                >
                                                    <Clock
                                                        className="h-4 w-4 text-amber-600"
                                                        data-oid="tx:-fq8"
                                                    />

                                                    <span
                                                        className="text-sm font-medium text-amber-800"
                                                        data-oid="v94j53e"
                                                    >
                                                        Order Purpose
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-sm text-amber-700 mt-1"
                                                    data-oid="ascqc70"
                                                >
                                                    {order.reason}
                                                </p>
                                            </div>
                                        )}

                                        {/* Products List */}
                                        <div className="space-y-3" data-oid="cypaf4w">
                                            <h4
                                                className="font-semibold text-gray-900 flex items-center"
                                                data-oid="9larqfq"
                                            >
                                                <Package
                                                    className="h-4 w-4 mr-2 text-cura-primary"
                                                    data-oid="tko0-ci"
                                                />
                                                Products Ordered
                                            </h4>
                                            <div className="grid gap-3" data-oid="tlkmsz4">
                                                {order.items.map((item, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
                                                        data-oid=".6iwnsb"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-3"
                                                            data-oid="n_mimsp"
                                                        >
                                                            <div
                                                                className="p-2 bg-white rounded-lg shadow-sm"
                                                                data-oid="6nwaf4r"
                                                            >
                                                                {getProductIcon(item.product)}
                                                            </div>
                                                            <div data-oid=":anv187">
                                                                <h5
                                                                    className="font-medium text-gray-900"
                                                                    data-oid="hfyx3l8"
                                                                >
                                                                    {item.product}
                                                                </h5>
                                                                <div
                                                                    className="flex items-center space-x-4 text-sm text-gray-600 mt-1"
                                                                    data-oid="7maroai"
                                                                >
                                                                    <span
                                                                        className="flex items-center"
                                                                        data-oid="jiwrv1n"
                                                                    >
                                                                        <span
                                                                            className="font-medium"
                                                                            data-oid="b3o9l8x"
                                                                        >
                                                                            Qty:
                                                                        </span>
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="ml-1 text-xs"
                                                                            data-oid="4folvr6"
                                                                        >
                                                                            {item.quantity}
                                                                        </Badge>
                                                                    </span>
                                                                    <span
                                                                        className="flex items-center"
                                                                        data-oid="l_2111t"
                                                                    >
                                                                        <DollarSign
                                                                            className="h-3 w-3 mr-1"
                                                                            data-oid="9uzfr.l"
                                                                        />

                                                                        <span
                                                                            className="font-medium"
                                                                            data-oid="eurypz5"
                                                                        >
                                                                            EGP{' '}
                                                                            {item.price.toFixed(2)}{' '}
                                                                            each
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="text-right"
                                                            data-oid="up6633_"
                                                        >
                                                            <div
                                                                className="text-lg font-bold text-cura-primary"
                                                                data-oid="1kpf:co"
                                                            >
                                                                EGP{' '}
                                                                {(
                                                                    item.quantity * item.price
                                                                ).toFixed(2)}
                                                            </div>
                                                            <div
                                                                className="text-xs text-gray-500"
                                                                data-oid="co5.g:l"
                                                            >
                                                                {item.quantity} ×{' '}
                                                                {item.price.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <Separator className="my-4" data-oid="pc2zm7b" />
                                        <div
                                            className="flex justify-between items-center p-4 bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 rounded-lg border border-cura-primary/10"
                                            data-oid="uaw-p1r"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="y8dkfwm"
                                            >
                                                <DollarSign
                                                    className="h-5 w-5 text-cura-primary"
                                                    data-oid="g6ytgpc"
                                                />

                                                <span
                                                    className="font-semibold text-cura-primary"
                                                    data-oid="4cyklgg"
                                                >
                                                    Order Total
                                                </span>
                                            </div>
                                            <div
                                                className="text-2xl font-bold text-cura-primary"
                                                data-oid="y2jv25m"
                                            >
                                                EGP {order.totalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Summary Footer */}
            <div
                className="mt-6 p-4 bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 rounded-xl border border-cura-primary/10"
                data-oid="hmys67g"
            >
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
                    data-oid="879fw6t"
                >
                    <div data-oid="::wrouo">
                        <div className="text-2xl font-bold text-cura-primary" data-oid="5cm7pw_">
                            {orders.length}
                        </div>
                        <div className="text-sm text-cura-primary/70" data-oid="1i2.qtt">
                            Total Orders
                        </div>
                    </div>
                    <div data-oid="6379twd">
                        <div className="text-2xl font-bold text-cura-primary" data-oid="a0l-mdy">
                            EGP{' '}
                            {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-cura-primary/70" data-oid="vw2hnrs">
                            Total Spent
                        </div>
                    </div>
                    <div data-oid="s0e2jgq">
                        <div className="text-2xl font-bold text-cura-primary" data-oid="q41rk:x">
                            EGP{' '}
                            {(
                                orders.reduce((sum, order) => sum + order.totalAmount, 0) /
                                orders.length
                            ).toFixed(2)}
                        </div>
                        <div className="text-sm text-cura-primary/70" data-oid="jmjh9na">
                            Average Order
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
