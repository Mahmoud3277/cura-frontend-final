'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ShoppingBag,
    Users,
    Calendar,
    FileText,
    Download,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';

interface Customer {
    customerId: string;
    customerName: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    totalPurchases: number;
    lastPurchased: string;
    frequency: string;
}

interface ProductPurchasePattern {
    productName: string;
    category: string;
    totalCustomers: number;
    totalQuantitySold: number;
    averageFrequency: number;
    customers: Customer[];
}

interface FrequentProductBuyersProps {
    productPatterns: ProductPurchasePattern[];
    onExportCSV: () => void;
    onExportExcel: () => void;
}

export function FrequentProductBuyers({
    productPatterns,
    onExportCSV,
    onExportExcel,
}: FrequentProductBuyersProps) {
    return (
        <div className="space-y-6" data-oid="g1j__xc">
            {/* Minimal Header */}
            <div className="flex items-center justify-between py-2" data-oid="o11-j5s">
                <div data-oid="hm6j1he">
                    <h2 className="text-xl font-semibold text-gray-900" data-oid="go3efr3">
                        Product Patterns
                    </h2>
                    <p className="text-sm text-gray-500" data-oid=":vv4fir">
                        Frequent buyers
                    </p>
                </div>
                <div className="flex gap-2" data-oid="li2wo.h">
                    <Button onClick={onExportCSV} variant="outline" size="sm" data-oid="f3xgqzj">
                        <FileText className="h-4 w-4 mr-1" data-oid="anv0_j9" />
                        CSV
                    </Button>
                    <Button onClick={onExportExcel} size="sm" data-oid="-pmc8rj">
                        <Download className="h-4 w-4 mr-1" data-oid="_gsa1tk" />
                        Excel
                    </Button>
                </div>
            </div>

            {/* Compact Stats */}
            <div className="flex gap-6 py-3 border-b" data-oid="g6etupe">
                <div className="flex items-center gap-2" data-oid="2cyt1ga">
                    <Users className="h-4 w-4 text-gray-400" data-oid="m5ztbcf" />
                    <span className="font-semibold" data-oid="5t7:l4p">
                        156
                    </span>
                    <span className="text-sm text-gray-500" data-oid="2:-ds.y">
                        customers
                    </span>
                </div>
                <div className="flex items-center gap-2" data-oid="xdyq74c">
                    <ShoppingBag className="h-4 w-4 text-gray-400" data-oid="9cnd5jz" />
                    <span className="font-semibold" data-oid="-9yzzap">
                        1,890
                    </span>
                    <span className="text-sm text-gray-500" data-oid="a_sq3eb">
                        units
                    </span>
                </div>
                <div className="flex items-center gap-2" data-oid=".41k0gh">
                    <Calendar className="h-4 w-4 text-gray-400" data-oid="2z8tr1t" />
                    <span className="font-semibold" data-oid="yt_wobv">
                        30
                    </span>
                    <span className="text-sm text-gray-500" data-oid="qhelktl">
                        days avg
                    </span>
                </div>
            </div>

            {/* Product Cards */}
            <div className="space-y-6" data-oid=":ogdykc">
                {productPatterns.map((pattern) => (
                    <Card
                        key={pattern.productName}
                        className="border-l-4 border-l-blue-500"
                        data-oid="n1tpyly"
                    >
                        <CardHeader className="pb-3" data-oid="fi441vs">
                            <div className="flex items-center justify-between" data-oid="q636983">
                                <div className="flex items-center gap-3" data-oid="3h:ke-t">
                                    <div data-oid="hv76h.7">
                                        <CardTitle className="text-lg" data-oid="kjaxc.b">
                                            {pattern.productName}
                                        </CardTitle>
                                        <CardDescription className="text-sm" data-oid="q.ovon:">
                                            {pattern.totalCustomers} customers •{' '}
                                            {pattern.totalQuantitySold} units •{' '}
                                            {pattern.averageFrequency} days avg
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs" data-oid="iy8_:n9">
                                    {pattern.category}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0" data-oid="nv75d4o">
                            {/* Customer Table */}
                            <div className="bg-gray-50 rounded-lg p-4" data-oid="68q_auc">
                                <h4
                                    className="font-semibold mb-3 flex items-center gap-2 text-gray-700"
                                    data-oid="218m-ep"
                                >
                                    <Users className="h-4 w-4" data-oid="7f4-gru" />
                                    Loyal Customer Base
                                </h4>
                                <p className="text-sm text-gray-600 mb-4" data-oid="iyrt:sf">
                                    Customers who consistently choose this product for their health
                                    needs
                                </p>

                                <div
                                    className="bg-white rounded-lg overflow-hidden"
                                    data-oid="3h1.-cz"
                                >
                                    <table className="min-w-full" data-oid="gj.snw7">
                                        <thead className="bg-gray-50 border-b" data-oid="c8habm1">
                                            <tr data-oid=".y3ve9l">
                                                <th
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="8rxg-_4"
                                                >
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="xjn8v30"
                                                    >
                                                        <Users
                                                            className="h-4 w-4"
                                                            data-oid="7p0-uh2"
                                                        />
                                                        Customer
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="owvi:q7"
                                                >
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="ogjt0j3"
                                                    >
                                                        <Phone
                                                            className="h-4 w-4"
                                                            data-oid=".feu13w"
                                                        />
                                                        Contact
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="kty3__x"
                                                >
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="5c-ar3s"
                                                    >
                                                        <MapPin
                                                            className="h-4 w-4"
                                                            data-oid="h5tsx9j"
                                                        />
                                                        Address
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="9zt.rqo"
                                                >
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="k3m5_na"
                                                    >
                                                        <ShoppingBag
                                                            className="h-4 w-4"
                                                            data-oid="30z6lqa"
                                                        />
                                                        Purchase History
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            data-oid="3ze9n2j"
                                        >
                                            {pattern.customers.map((customer, index) => (
                                                <tr
                                                    key={customer.customerId}
                                                    className="hover:bg-gray-50"
                                                    data-oid="8ut4-kr"
                                                >
                                                    <td
                                                        className="px-4 py-4 whitespace-nowrap"
                                                        data-oid="fj-q2in"
                                                    >
                                                        <div
                                                            className="flex items-center"
                                                            data-oid="vva9_rg"
                                                        >
                                                            <div
                                                                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                                                                data-oid="o25xadi"
                                                            >
                                                                {customer.customerName
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')}
                                                            </div>
                                                            <div
                                                                className="ml-3"
                                                                data-oid="kn04.ks"
                                                            >
                                                                <div
                                                                    className="text-sm font-medium text-gray-900"
                                                                    data-oid="lqbn._6"
                                                                >
                                                                    {customer.customerName}
                                                                </div>
                                                                <div
                                                                    className="text-sm text-gray-500"
                                                                    data-oid="4p52_:w"
                                                                >
                                                                    {customer.customerId}
                                                                </div>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="mt-1 text-xs"
                                                                    data-oid="0kh-ncr"
                                                                >
                                                                    Loyal Customer
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="px-4 py-4 whitespace-nowrap"
                                                        data-oid="g_bq3xj"
                                                    >
                                                        <div
                                                            className="space-y-1"
                                                            data-oid="8rqetjz"
                                                        >
                                                            <div
                                                                className="flex items-center text-sm text-gray-900"
                                                                data-oid="x22x..m"
                                                            >
                                                                <Mail
                                                                    className="h-4 w-4 mr-2 text-gray-400"
                                                                    data-oid="ba582eu"
                                                                />

                                                                <span
                                                                    className="truncate max-w-[200px]"
                                                                    data-oid="ttn0dw1"
                                                                >
                                                                    {customer.email}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center text-sm text-gray-600"
                                                                data-oid="dk5ttn_"
                                                            >
                                                                <Phone
                                                                    className="h-4 w-4 mr-2 text-gray-400"
                                                                    data-oid="sx13803"
                                                                />

                                                                <span data-oid="2_i9_yo">
                                                                    {customer.phone}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center text-sm text-green-600"
                                                                data-oid="0mt6ehb"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4 mr-2 text-green-500"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid=":f:z5ip"
                                                                >
                                                                    <path
                                                                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"
                                                                        data-oid="sfo2h2a"
                                                                    />
                                                                </svg>
                                                                <span data-oid="ebdnvad">
                                                                    {customer.whatsapp}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4" data-oid=".fu:zid">
                                                        <div
                                                            className="space-y-1"
                                                            data-oid="9al1lq1"
                                                        >
                                                            <div
                                                                className="flex items-start text-sm text-gray-900"
                                                                data-oid="k5g4aae"
                                                            >
                                                                <MapPin
                                                                    className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0"
                                                                    data-oid="rsgb:9n"
                                                                />

                                                                <span
                                                                    className="max-w-[200px] break-words"
                                                                    data-oid="_pk0ndt"
                                                                >
                                                                    {customer.address}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center text-sm text-blue-600 font-medium ml-6"
                                                                data-oid="36.2s7m"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4 mr-1 text-blue-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid=":.9smna"
                                                                >
                                                                    <path
                                                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                                                        data-oid="6m:y6j_"
                                                                    />
                                                                </svg>
                                                                {customer.city}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="px-4 py-4 whitespace-nowrap"
                                                        data-oid="i.aykbl"
                                                    >
                                                        <div
                                                            className="space-y-2"
                                                            data-oid="diwowml"
                                                        >
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="wrtg8b4"
                                                            >
                                                                <div
                                                                    className="p-2 bg-blue-100 rounded-lg"
                                                                    data-oid="j3ihpza"
                                                                >
                                                                    <ShoppingBag
                                                                        className="h-4 w-4 text-blue-600"
                                                                        data-oid="wy13:u."
                                                                    />
                                                                </div>
                                                                <div data-oid="t_::zoa">
                                                                    <div
                                                                        className="text-sm font-semibold text-gray-900"
                                                                        data-oid="7nrs6pj"
                                                                    >
                                                                        {customer.totalPurchases}{' '}
                                                                        purchases
                                                                    </div>
                                                                    <div
                                                                        className="text-xs text-gray-500"
                                                                        data-oid="6iu_s_i"
                                                                    >
                                                                        Last:{' '}
                                                                        {customer.lastPurchased}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                                data-oid="9v-402m"
                                                            >
                                                                {customer.frequency}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
