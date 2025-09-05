'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, User, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import { OrderHistorySlider } from '@/components/ui/order-history-slider';

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

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    avgOrderValue?: number;
    frequency: string;
    nextExpectedOrder: string;
    preferredProducts: string[];
    orderHistory?: OrderHistory[];
}

interface CustomerOrderHistoryModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CustomerOrderHistoryModal({
    customer,
    isOpen,
    onClose,
}: CustomerOrderHistoryModalProps) {
    if (!isOpen || !customer) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            data-oid="8rd5t6o"
        >
            <div
                className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100"
                data-oid="_2ehzg1"
            >
                {/* Simple Header */}
                <div
                    className="flex justify-between items-center p-6 border-b border-gray-200"
                    data-oid="o4e85ik"
                >
                    <h2 className="text-2xl font-bold text-gray-900" data-oid="mf1nfml">
                        Customer Details
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                        data-oid="b.mm1n9"
                    >
                        <X className="h-5 w-5" data-oid="..gl9nl" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]" data-oid="wsx_jmr">
                    {/* Enhanced Customer Info Cards with CURA Branding */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                        data-oid="69d2bcp"
                    >
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-cura transition-all duration-300"
                            data-oid="sg8.m65"
                        >
                            <CardContent className="p-6" data-oid="8fy_f7z">
                                <div className="flex items-start space-x-4" data-oid="r0.g_h9">
                                    <div
                                        className="p-3 bg-cura-primary rounded-xl shadow-md flex-shrink-0"
                                        data-oid="qjok86x"
                                    >
                                        <User className="h-5 w-5 text-white" data-oid="_dycfua" />
                                    </div>
                                    <div className="flex-1 min-w-0" data-oid=":we.8op">
                                        <p
                                            className="text-sm text-cura-primary font-semibold mb-3"
                                            data-oid="oq3.sm8"
                                        >
                                            Contact Info
                                        </p>
                                        <div className="space-y-2" data-oid="u0x1fqu">
                                            <div
                                                className="flex items-start text-sm text-gray-700 min-w-0"
                                                data-oid="4xrkzaw"
                                            >
                                                <Mail
                                                    className="h-4 w-4 mr-2 text-cura-primary/60 flex-shrink-0 mt-0.5"
                                                    data-oid="0lt39tg"
                                                />

                                                <span
                                                    className="truncate min-w-0 break-all"
                                                    title={customer.email}
                                                    data-oid="x-it8rr"
                                                >
                                                    {customer.email}
                                                </span>
                                            </div>
                                            <div
                                                className="flex items-center text-sm text-gray-700"
                                                data-oid="cfrtsj:"
                                            >
                                                <Phone
                                                    className="h-4 w-4 mr-2 text-cura-primary/60 flex-shrink-0"
                                                    data-oid="2f6i8zr"
                                                />

                                                <span className="truncate" data-oid="qs5ac:2">
                                                    {customer.phone}
                                                </span>
                                            </div>
                                            <div
                                                className="flex items-center text-sm text-gray-700"
                                                data-oid="fmcq1i0"
                                            >
                                                <MapPin
                                                    className="h-4 w-4 mr-2 text-cura-primary/60 flex-shrink-0"
                                                    data-oid="9_a0qtl"
                                                />

                                                <span className="truncate" data-oid="--w-8i-">
                                                    {customer.city}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300"
                            data-oid=":l5te3m"
                        >
                            <CardContent className="p-6" data-oid="e1t8q53">
                                <div className="flex items-start space-x-4" data-oid="1pz5wn6">
                                    <div
                                        className="p-3 bg-emerald-600 rounded-xl shadow-md"
                                        data-oid="k-3cx2w"
                                    >
                                        <DollarSign
                                            className="h-5 w-5 text-white"
                                            data-oid="z6ka9v5"
                                        />
                                    </div>
                                    <div className="flex-1" data-oid="6mugy52">
                                        <p
                                            className="text-sm text-emerald-600 font-semibold mb-3"
                                            data-oid="3t11eae"
                                        >
                                            Purchase Stats
                                        </p>
                                        <div className="space-y-2" data-oid="85pjwvq">
                                            <p
                                                className="text-lg font-bold text-emerald-900"
                                                data-oid="3ya8g0b"
                                            >
                                                {customer.totalOrders || 0} Orders
                                            </p>
                                            <p
                                                className="text-sm text-emerald-700 font-medium"
                                                data-oid="m20axhb"
                                            >
                                                EGP{' '}
                                                {customer.totalSpent
                                                    ? customer.totalSpent.toLocaleString()
                                                    : '0'}{' '}
                                                Total
                                            </p>
                                            <p
                                                className="text-sm text-emerald-600"
                                                data-oid="w_wtrel"
                                            >
                                                EGP{' '}
                                                {customer.avgOrderValue
                                                    ? customer.avgOrderValue.toFixed(2)
                                                    : (
                                                          customer.totalSpent /
                                                          Math.max(customer.totalOrders, 1)
                                                      ).toFixed(2)}{' '}
                                                Avg
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:shadow-lg transition-all duration-300"
                            data-oid="e1ohw6k"
                        >
                            <CardContent className="p-6" data-oid="4-3u.i-">
                                <div className="flex items-start space-x-4" data-oid="6wx-5n2">
                                    <div
                                        className="p-3 bg-violet-600 rounded-xl shadow-md"
                                        data-oid="cr4oqi_"
                                    >
                                        <Calendar
                                            className="h-5 w-5 text-white"
                                            data-oid="n98-c17"
                                        />
                                    </div>
                                    <div className="flex-1" data-oid="aamm8zf">
                                        <p
                                            className="text-sm text-violet-600 font-semibold mb-3"
                                            data-oid="u1u-mdr"
                                        >
                                            Order Frequency
                                        </p>
                                        <div className="space-y-2" data-oid="i8e_4:t">
                                            <p
                                                className="text-lg font-bold text-violet-900"
                                                data-oid="i1s0m50"
                                            >
                                                {customer.frequency || 'Unknown'}
                                            </p>
                                            <p
                                                className="text-sm text-violet-700"
                                                data-oid="2q3.68c"
                                            >
                                                Last: {customer.lastOrder || 'No orders yet'}
                                            </p>
                                            <p
                                                className="text-sm text-violet-600"
                                                data-oid="8yn7ebn"
                                            >
                                                Next: {customer.nextExpectedOrder || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300"
                            data-oid="rmr0bma"
                        >
                            <CardContent className="p-6" data-oid="739vqf6">
                                <div data-oid="yqn3ise">
                                    <p
                                        className="text-sm text-amber-600 font-semibold mb-3"
                                        data-oid="k0wzsnm"
                                    >
                                        Preferred Products
                                    </p>
                                    <div className="space-y-2" data-oid="gsy0jcg">
                                        {customer.preferredProducts &&
                                        customer.preferredProducts.length > 0 ? (
                                            customer.preferredProducts
                                                .slice(0, 3)
                                                .map((product, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="text-sm mr-2 mb-2 bg-amber-100 text-amber-800 border-amber-200"
                                                        data-oid="29t1264"
                                                    >
                                                        {product}
                                                    </Badge>
                                                ))
                                        ) : (
                                            <p
                                                className="text-sm text-amber-600"
                                                data-oid="z1:6m30"
                                            >
                                                No preferred products yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order History Section - Clean and Simple */}
                    <div className="mt-8" data-oid="ryc0iw9">
                        {customer.orderHistory && customer.orderHistory.length > 0 ? (
                            <OrderHistorySlider
                                orders={customer.orderHistory}
                                className=""
                                data-oid="b7zmdrc"
                            />
                        ) : (
                            <Card className="border-0 shadow-lg bg-white" data-oid="hpchkmk">
                                <CardContent className="text-center py-16 px-6" data-oid="ahao2.v">
                                    <div
                                        className="p-6 bg-gradient-to-br from-cura-primary/5 to-cura-secondary/5 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-cura-primary/10"
                                        data-oid="re78nn9"
                                    >
                                        <Calendar
                                            className="h-10 w-10 text-cura-primary/60"
                                            data-oid="gfcsoyo"
                                        />
                                    </div>
                                    <h3
                                        className="text-xl font-bold text-gray-900 mb-3"
                                        data-oid="noxhml5"
                                    >
                                        No Detailed Order History Available
                                    </h3>
                                    <p
                                        className="text-gray-600 mb-4 max-w-md mx-auto leading-relaxed"
                                        data-oid="i8ejspa"
                                    >
                                        {customer.totalOrders > 0
                                            ? `This customer has ${customer.totalOrders} orders totaling EGP ${customer.totalSpent?.toLocaleString() || '0'}, but detailed order history is not available in the current view.`
                                            : "This customer hasn't placed any orders yet. Once they make their first purchase, their order history will appear here."}
                                    </p>
                                    {customer.totalOrders > 0 && (
                                        <div
                                            className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto"
                                            data-oid="5oux3al"
                                        >
                                            <p
                                                className="text-sm text-blue-800 font-medium"
                                                data-oid="5.wfal9"
                                            >
                                                💡 Order statistics are shown in the summary cards
                                                above based on available data.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
