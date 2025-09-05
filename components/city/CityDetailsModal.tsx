'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    MapPin,
    Building2,
    Stethoscope,
    ShoppingBag,
    Users,
    Phone,
    Mail,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { getCityById } from '@/lib/data/cities';

interface CityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cityId: string | null;
}

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    rating: number;
    isActive: boolean;
    openHours: string;
    totalOrders: number;
    revenue: number;
}

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    rating: number;
    isActive: boolean;
    totalConsultations: number;
    experience: number;
}

interface Vendor {
    id: string;
    name: string;
    category: string;
    phone: string;
    email: string;
    rating: number;
    isActive: boolean;
    totalProducts: number;
    revenue: number;
}

export default function CityDetailsModal({ isOpen, onClose, cityId }: CityDetailsModalProps) {
    const [city, setCity] = useState<any>(null);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && cityId) {
            loadCityDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, cityId]);

    const loadCityDetails = async () => {
        setIsLoading(true);
        try {
            // Get city data
            const cityData = getCityById(cityId!);
            setCity(cityData);

            // Mock data for pharmacies, doctors, and vendors
            // In a real app, this would come from your API
            const mockPharmacies: Pharmacy[] = [
                {
                    id: '1',
                    name: 'Al Ezaby Pharmacy',
                    address: '123 Main Street, ' + cityData?.nameEn,
                    phone: '+20 123 456 789',
                    email: 'contact@alezaby.com',
                    rating: 4.5,
                    isActive: true,
                    openHours: '8:00 AM - 10:00 PM',
                    totalOrders: 1250,
                    revenue: 125000,
                },
                {
                    id: '2',
                    name: 'Seif Pharmacy',
                    address: '456 Second Street, ' + cityData?.nameEn,
                    phone: '+20 123 456 790',
                    email: 'info@seifpharmacy.com',
                    rating: 4.2,
                    isActive: true,
                    openHours: '9:00 AM - 11:00 PM',
                    totalOrders: 980,
                    revenue: 98000,
                },
                {
                    id: '3',
                    name: 'Care Pharmacy',
                    address: '789 Third Avenue, ' + cityData?.nameEn,
                    phone: '+20 123 456 791',
                    email: 'support@carepharmacy.com',
                    rating: 4.7,
                    isActive: false,
                    openHours: '24/7',
                    totalOrders: 1500,
                    revenue: 150000,
                },
            ];

            const mockDoctors: Doctor[] = [
                {
                    id: '1',
                    name: 'Dr. Ahmed Hassan',
                    specialty: 'Cardiology',
                    phone: '+20 123 456 792',
                    email: 'ahmed.hassan@hospital.com',
                    rating: 4.8,
                    isActive: true,
                    totalConsultations: 500,
                    experience: 15,
                },
                {
                    id: '2',
                    name: 'Dr. Fatma Ali',
                    specialty: 'Pediatrics',
                    phone: '+20 123 456 793',
                    email: 'fatma.ali@clinic.com',
                    rating: 4.6,
                    isActive: true,
                    totalConsultations: 750,
                    experience: 12,
                },
                {
                    id: '3',
                    name: 'Dr. Mohamed Saeed',
                    specialty: 'Internal Medicine',
                    phone: '+20 123 456 794',
                    email: 'mohamed.saeed@medical.com',
                    rating: 4.4,
                    isActive: true,
                    totalConsultations: 320,
                    experience: 8,
                },
            ];

            const mockVendors: Vendor[] = [
                {
                    id: '1',
                    name: 'HealthCare Supplies Co.',
                    category: 'Medical Equipment',
                    phone: '+20 123 456 795',
                    email: 'sales@healthcaresupplies.com',
                    rating: 4.3,
                    isActive: true,
                    totalProducts: 150,
                    revenue: 75000,
                },
                {
                    id: '2',
                    name: 'MediTech Solutions',
                    category: 'Digital Health',
                    phone: '+20 123 456 796',
                    email: 'info@meditech.com',
                    rating: 4.5,
                    isActive: true,
                    totalProducts: 85,
                    revenue: 120000,
                },
                {
                    id: '3',
                    name: 'Wellness Products Ltd.',
                    category: 'Supplements',
                    phone: '+20 123 456 797',
                    email: 'contact@wellness.com',
                    rating: 4.1,
                    isActive: false,
                    totalProducts: 200,
                    revenue: 45000,
                },
            ];

            setPharmacies(mockPharmacies);
            setDoctors(mockDoctors);
            setVendors(mockVendors);
        } catch (error) {
            console.error('Error loading city details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!city) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="fx51ad2">
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-oid="3_so6ra">
                <DialogHeader data-oid="9dcxn1a">
                    <DialogTitle className="flex items-center space-x-2" data-oid="ghx.y81">
                        <MapPin className="w-5 h-5 text-blue-600" data-oid="ycugneu" />
                        <span data-oid="t0o3gte">
                            {city.nameEn} ({city.nameAr})
                        </span>
                        <Badge
                            variant={city.isEnabled ? 'default' : 'secondary'}
                            className="ml-2"
                            data-oid="i4scxk3"
                        >
                            {city.isEnabled ? 'Available' : 'Disabled'}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8" data-oid="ldf0ycb">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                            data-oid="41kfkwo"
                        ></div>
                    </div>
                ) : (
                    <div className="space-y-6" data-oid="bkb1bl5">
                        {/* City Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid="kq11o7p">
                            <Card data-oid="px87gtl">
                                <CardContent className="p-4" data-oid="aetk_iy">
                                    <div className="flex items-center space-x-2" data-oid="_pgcrq5">
                                        <Building2
                                            className="w-4 h-4 text-blue-600"
                                            data-oid="m7oic1k"
                                        />

                                        <span className="text-sm text-gray-600" data-oid="hz3a8pr">
                                            Pharmacies
                                        </span>
                                    </div>
                                    <div
                                        className="text-2xl font-bold text-gray-900"
                                        data-oid="cwskusr"
                                    >
                                        {pharmacies.length}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card data-oid="t66a_l2">
                                <CardContent className="p-4" data-oid="km8rhx5">
                                    <div className="flex items-center space-x-2" data-oid="aii1fam">
                                        <Stethoscope
                                            className="w-4 h-4 text-green-600"
                                            data-oid="_8:qbnh"
                                        />

                                        <span className="text-sm text-gray-600" data-oid="d.nmcq_">
                                            Doctors
                                        </span>
                                    </div>
                                    <div
                                        className="text-2xl font-bold text-gray-900"
                                        data-oid="lpra8:g"
                                    >
                                        {doctors.length}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card data-oid="v1rh27o">
                                <CardContent className="p-4" data-oid="_6qbr4y">
                                    <div className="flex items-center space-x-2" data-oid="e9565a1">
                                        <ShoppingBag
                                            className="w-4 h-4 text-purple-600"
                                            data-oid="gpdv6jr"
                                        />

                                        <span className="text-sm text-gray-600" data-oid="t.1.c20">
                                            Vendors
                                        </span>
                                    </div>
                                    <div
                                        className="text-2xl font-bold text-gray-900"
                                        data-oid="dd1i1aa"
                                    >
                                        {vendors.length}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card data-oid=":6g92bb">
                                <CardContent className="p-4" data-oid="v_znzmj">
                                    <div className="flex items-center space-x-2" data-oid="z7hjacj">
                                        <MapPin
                                            className="w-4 h-4 text-orange-600"
                                            data-oid="2zbkjwh"
                                        />

                                        <span className="text-sm text-gray-600" data-oid="aoyiry.">
                                            Governorate
                                        </span>
                                    </div>
                                    <div
                                        className="text-sm font-semibold text-gray-900"
                                        data-oid="j275op:"
                                    >
                                        {city.governorateName}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Tabs */}
                        <Tabs defaultValue="pharmacies" className="w-full" data-oid="ypfc-6j">
                            <TabsList className="grid w-full grid-cols-3" data-oid="i6t79bw">
                                <TabsTrigger value="pharmacies" data-oid="rc_ef:0">
                                    Pharmacies
                                </TabsTrigger>
                                <TabsTrigger value="doctors" data-oid="x.3fnuw">
                                    Doctors
                                </TabsTrigger>
                                <TabsTrigger value="vendors" data-oid="edq:j.q">
                                    Vendors
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="pharmacies"
                                className="space-y-4"
                                data-oid="rnniy2a"
                            >
                                <div className="grid gap-4" data-oid="jf165t4">
                                    {pharmacies.map((pharmacy) => (
                                        <Card key={pharmacy.id} data-oid=".._r--z">
                                            <CardContent className="p-4" data-oid=":fufknd">
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="lo3bjix"
                                                >
                                                    <div className="space-y-2" data-oid="1747oxg">
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="upn9e3b"
                                                        >
                                                            <h3
                                                                className="font-semibold text-gray-900"
                                                                data-oid="hygracn"
                                                            >
                                                                {pharmacy.name}
                                                            </h3>
                                                            <Badge
                                                                variant={
                                                                    pharmacy.isActive
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                data-oid="so362sf"
                                                            >
                                                                {pharmacy.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </Badge>
                                                        </div>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="q36xw8o"
                                                        >
                                                            {pharmacy.address}
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-4 text-sm text-gray-500"
                                                            data-oid="gkr3bvo"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="u4uwr1w"
                                                            >
                                                                <Phone
                                                                    className="w-3 h-3"
                                                                    data-oid="bnf_22c"
                                                                />

                                                                <span data-oid="-j0x_wr">
                                                                    {pharmacy.phone}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="s00z3y1"
                                                            >
                                                                <Mail
                                                                    className="w-3 h-3"
                                                                    data-oid="gh94xul"
                                                                />

                                                                <span data-oid="qk6o4eb">
                                                                    {pharmacy.email}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="wheot_h"
                                                            >
                                                                <Clock
                                                                    className="w-3 h-3"
                                                                    data-oid="fmhkw5g"
                                                                />

                                                                <span data-oid="vfebk_:">
                                                                    {pharmacy.openHours}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-right space-y-1"
                                                        data-oid="4g.c35p"
                                                    >
                                                        <div
                                                            className="text-xs text-gray-500"
                                                            data-oid="p5tzco:"
                                                        >
                                                            {pharmacy.totalOrders} orders
                                                        </div>
                                                        <div
                                                            className="text-xs text-green-600 font-medium"
                                                            data-oid="tweq071"
                                                        >
                                                            EGP {pharmacy.revenue.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="doctors" className="space-y-4" data-oid="z:f6qt8">
                                <div className="grid gap-4" data-oid="12g_nz9">
                                    {doctors.map((doctor) => (
                                        <Card key={doctor.id} data-oid="msus:xw">
                                            <CardContent className="p-4" data-oid="usb4wpd">
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="ie:blp:"
                                                >
                                                    <div className="space-y-2" data-oid="w788wxc">
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="nyp1qry"
                                                        >
                                                            <h3
                                                                className="font-semibold text-gray-900"
                                                                data-oid="7z1wm_t"
                                                            >
                                                                {doctor.name}
                                                            </h3>
                                                            <Badge
                                                                variant={
                                                                    doctor.isActive
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                data-oid="aspto9d"
                                                            >
                                                                {doctor.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </Badge>
                                                        </div>
                                                        <p
                                                            className="text-sm text-blue-600 font-medium"
                                                            data-oid="kogpnat"
                                                        >
                                                            {doctor.specialty}
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-4 text-sm text-gray-500"
                                                            data-oid="ast017y"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="3t_kc55"
                                                            >
                                                                <Phone
                                                                    className="w-3 h-3"
                                                                    data-oid="a5p:65v"
                                                                />

                                                                <span data-oid="rr8m7zp">
                                                                    {doctor.phone}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="ux_8xs3"
                                                            >
                                                                <Mail
                                                                    className="w-3 h-3"
                                                                    data-oid="vq3w4c9"
                                                                />

                                                                <span data-oid="1vc38z0">
                                                                    {doctor.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-right space-y-1"
                                                        data-oid="n7y-0_l"
                                                    ></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="vendors" className="space-y-4" data-oid="o0bzq8-">
                                <div className="grid gap-4" data-oid="n-k5hfb">
                                    {vendors.map((vendor) => (
                                        <Card key={vendor.id} data-oid="t7m:rql">
                                            <CardContent className="p-4" data-oid=":1_mvtc">
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="fb:36:h"
                                                >
                                                    <div className="space-y-2" data-oid="4rbd9xs">
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="5pdv5m7"
                                                        >
                                                            <h3
                                                                className="font-semibold text-gray-900"
                                                                data-oid="w9mr09o"
                                                            >
                                                                {vendor.name}
                                                            </h3>
                                                            <Badge
                                                                variant={
                                                                    vendor.isActive
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                data-oid=".c:s_my"
                                                            >
                                                                {vendor.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </Badge>
                                                        </div>
                                                        <p
                                                            className="text-sm text-purple-600 font-medium"
                                                            data-oid="8x9m6iu"
                                                        >
                                                            {vendor.category}
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-4 text-sm text-gray-500"
                                                            data-oid="g.4soy5"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="v-ii8ee"
                                                            >
                                                                <Phone
                                                                    className="w-3 h-3"
                                                                    data-oid="xr5uwsb"
                                                                />

                                                                <span data-oid="kv_rn8-">
                                                                    {vendor.phone}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="312565:"
                                                            >
                                                                <Mail
                                                                    className="w-3 h-3"
                                                                    data-oid="iyhv_f6"
                                                                />

                                                                <span data-oid="8g-v0yx">
                                                                    {vendor.email}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-1"
                                                                data-oid="48rk:fq"
                                                            >
                                                                <ShoppingBag
                                                                    className="w-3 h-3"
                                                                    data-oid="9v0ub.e"
                                                                />

                                                                <span data-oid="v_9naok">
                                                                    {vendor.totalProducts} products
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-right space-y-1"
                                                        data-oid="-zxekq0"
                                                    >
                                                        <div
                                                            className="text-xs text-green-600 font-medium"
                                                            data-oid="bp2bbci"
                                                        >
                                                            EGP {vendor.revenue.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
