'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, Eye, TrendingUp } from 'lucide-react';

interface OrderHistory {
    orderDate: string;
    orderId: string;
    items: { product: string; quantity: number; price: number }[];
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
    avgOrderValue: number;
    frequency: string;
    nextExpectedOrder: string;
    preferredProducts: string[];
    orderHistory?: OrderHistory[];
}

interface CustomerListProps {
    customers: Customer[];
    onCustomerClick: (customer: Customer) => void;
    className?: string;
}

export function CustomerList({ customers, onCustomerClick, className = '' }: CustomerListProps) {
    if (customers.length === 0) {
        return (
            <div className={`text-center py-12 text-gray-500 ${className}`} data-oid="rcace2o">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" data-oid="qt.ee-." />
                <p className="text-lg font-medium" data-oid="jyj0ab2">
                    No customers found
                </p>
                <p className="text-sm" data-oid="k25_mp:">
                    No customers match the current criteria
                </p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border ${className}`} data-oid="7-jqr__">
            <div className="overflow-x-auto" data-oid="r9hkp-_">
                <table className="min-w-full divide-y divide-gray-200" data-oid="i-3v_a9">
                    <thead className="bg-gray-50" data-oid=":e7oq5a">
                        <tr data-oid="nia2pei">
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="82gmg43"
                            >
                                Customer
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="11ln-a-"
                            >
                                Contact Info
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="ymk3hrn"
                            >
                                Orders & Spending
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="-tni:iy"
                            >
                                Frequency
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="1ra-wl:"
                            >
                                Preferred Products
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="raas3d."
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" data-oid="tigvbhq">
                        {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => onCustomerClick(customer)}
                                data-oid="38-slzd"
                            >
                                {/* Customer Info */}
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="xn6-:od">
                                    <div className="flex items-center" data-oid="jt7o8vw">
                                        <div
                                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                                            data-oid="-n9vmyt"
                                        >
                                            {customer.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </div>
                                        <div className="ml-4" data-oid="5a0ah47">
                                            <div
                                                className="text-sm font-medium text-gray-900"
                                                data-oid="l24t0dx"
                                            >
                                                {customer.name}
                                            </div>
                                            <div
                                                className="text-sm text-gray-500"
                                                data-oid="-35qwrb"
                                            >
                                                {customer.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact Info */}
                                <td className="px-6 py-4 whitespace-nowrap" data-oid=".fr-bg_">
                                    <div className="space-y-1" data-oid="kco_:b2">
                                        <div
                                            className="flex items-center text-sm text-gray-900"
                                            data-oid="urw9h0n"
                                        >
                                            <Mail
                                                className="h-3 w-3 mr-2 text-gray-400"
                                                data-oid="lryvfb7"
                                            />

                                            <span
                                                className="truncate max-w-[200px]"
                                                data-oid="cpl18a0"
                                            >
                                                {customer.email}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center text-sm text-gray-600"
                                            data-oid="r.of:1:"
                                        >
                                            <Phone
                                                className="h-3 w-3 mr-2 text-gray-400"
                                                data-oid="0gqjbmf"
                                            />

                                            <span data-oid="l0:dhnb">{customer.phone}</span>
                                        </div>
                                        <div
                                            className="flex items-center text-sm text-gray-600"
                                            data-oid="g_e2pje"
                                        >
                                            <MapPin
                                                className="h-3 w-3 mr-2 text-gray-400"
                                                data-oid="bd83p.2"
                                            />

                                            <span data-oid="lwmfyip">{customer.city}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Orders & Spending */}
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="fg4k1:t">
                                    <div className="space-y-1" data-oid="jbrs.g4">
                                        <div
                                            className="text-sm font-medium text-gray-900"
                                            data-oid="-l4nere"
                                        >
                                            {customer.totalOrders} Orders
                                        </div>
                                        <div
                                            className="text-sm text-green-600 font-semibold"
                                            data-oid="ivc7ew5"
                                        >
                                            EGP {customer.totalSpent.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500" data-oid="xxja6q4">
                                            Avg: EGP {customer.avgOrderValue.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500" data-oid="renlkra">
                                            Last: {customer.lastOrder}
                                        </div>
                                    </div>
                                </td>

                                {/* Frequency */}
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="rhpxau_">
                                    <div className="space-y-2" data-oid="kujars.">
                                        <Badge
                                            variant={
                                                customer.frequency === 'Weekly'
                                                    ? 'default'
                                                    : customer.frequency === 'Monthly'
                                                      ? 'secondary'
                                                      : 'outline'
                                            }
                                            className="text-xs"
                                            data-oid="j9e9etm"
                                        >
                                            {customer.frequency}
                                        </Badge>
                                        <div className="text-xs text-gray-500" data-oid="cf0rd-3">
                                            Next: {customer.nextExpectedOrder}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                            data-oid="7ndcp8v"
                                        >
                                            {customer.orderHistory?.length ||
                                                customer.totalOrders ||
                                                0}{' '}
                                            history
                                        </Badge>
                                    </div>
                                </td>

                                {/* Preferred Products */}
                                <td className="px-6 py-4" data-oid="_l:azdc">
                                    <div className="space-y-1" data-oid="-hdgqoi">
                                        {customer.preferredProducts
                                            .slice(0, 3)
                                            .map((product, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs mr-1 mb-1"
                                                    data-oid="wfr2uwi"
                                                >
                                                    {product}
                                                </Badge>
                                            ))}
                                        {customer.preferredProducts.length > 3 && (
                                            <div
                                                className="text-xs text-gray-500"
                                                data-oid="l:37tm5"
                                            >
                                                +{customer.preferredProducts.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="1fumybi">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center space-x-2 hover:bg-cura-primary/5 hover:border-cura-primary/30 hover:text-cura-primary transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCustomerClick(customer);
                                        }}
                                        data-oid=":e74w0n"
                                    >
                                        <Eye className="h-4 w-4" data-oid="61npb.m" />
                                        <span data-oid="f7041d9">View Details</span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
