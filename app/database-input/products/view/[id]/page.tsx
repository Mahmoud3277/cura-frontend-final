'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { masterProductDatabase, MasterProduct } from '@/lib/database/masterProductDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateProduct, getProductById } from '@/lib/data/products';
export default function ViewProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState<MasterProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(productId)
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const loadProduct = async() => {
        const foundProduct = await getProductById(productId);
        if (foundProduct) {
            setProduct(foundProduct);
        }
        setIsLoading(false);
    };

    const handleEdit = () => {
        router.push(`/database-input/products/edit/${productId}`);
    };

    const handleBack = () => {
        router.push('/database-input/products');
    };

    const getEligibilityBadge = (product: MasterProduct) => {
        if (product.pharmacyEligible && product.vendorEligible) {
            return (
                <Badge
                    className="bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20"
                    data-oid="psgg0gw"
                >
                    Both
                </Badge>
            );
        } else if (product.pharmacyEligible) {
            return (
                <Badge
                    className="bg-[#14274E]/10 text-[#14274E] border border-[#14274E]/20"
                    data-oid="j.zy.wn"
                >
                    Pharmacy Only
                </Badge>
            );
        } else if (product.vendorEligible) {
            return (
                <Badge
                    className="bg-gray-100 text-gray-700 border border-gray-200"
                    data-oid="8i5d5es"
                >
                    Vendor Only
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-100 text-gray-600 border border-gray-200" data-oid="h832loh">
                None
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const colors = {
            medicine: 'bg-[#14274E]/10 text-[#14274E] border border-[#14274E]/20',
            'medical-supply': 'bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20',
            'hygiene-supply': 'bg-gray-100 text-gray-700 border border-gray-200',
            'medical-device': 'bg-gray-100 text-gray-600 border border-gray-200',
        };
        return (
            <Badge
                className={
                    colors[type as keyof typeof colors] ||
                    'bg-gray-100 text-gray-600 border border-gray-200'
                }
                data-oid="2:3_msq"
            >
                {type}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="o1iczit">
                <div className="text-center" data-oid="0vrx04e">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="s73pfdd"
                    ></div>
                    <p className="text-gray-600" data-oid="v3qmegx">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12" data-oid="0_62jwj">
                <div
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid="z:v_3cc"
                >
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="sosd_1g"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            data-oid="lf4p63-"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="jlo002p">
                    Product Not Found
                </h3>
                <p className="text-gray-600 mb-4" data-oid="r:aowi.">
                    The product you{"'"}re looking for doesn{"'"}t exist.
                </p>
                <Button onClick={handleBack} data-oid="b66:i_0">
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="vnpwu-j">
            {/* Header */}
            <div className="flex items-center justify-between" data-oid="u.0hdsy">
                <div data-oid="jekrwyb">
                    <h1 className="text-2xl font-bold text-gray-900" data-oid="ce_ulxf">
                        {product.name}
                    </h1>
                    <p className="text-gray-600" data-oid="t2psajg">
                        {product.manufacturer}
                    </p>
                </div>
                <div className="flex items-center space-x-3" data-oid="72mo3ex">
                    <Button variant="outline" onClick={handleBack} data-oid="mj0nho9">
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="4jt9fx-"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                data-oid="r_20:vz"
                            />
                        </svg>
                        Back to Products
                    </Button>
                    <Button
                        onClick={handleEdit}
                        className="bg-[#1F1F6F] hover:bg-[#14274E] text-white"
                        data-oid="3fy4lnp"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="-fd.:ow"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                data-oid="vv-ppbc"
                            />
                        </svg>
                        Edit Product
                    </Button>
                </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-oid="p9b9jl7">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6" data-oid="a86z8-2">
                    <Card data-oid="2ag9pgi">
                        <CardHeader data-oid=".pj2i.f">
                            <CardTitle className="text-gray-800" data-oid="3rg_e15">
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" data-oid="qqwpvyn">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="7ki_53b"
                            >
                                <div data-oid="5qlx.4v">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="jpneoe1"
                                    >
                                        Product Name (English)
                                    </h4>
                                    <p className="text-gray-600" data-oid="n37k6qo">
                                        {product.name}
                                    </p>
                                </div>
                                <div data-oid="owdcr0v">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="85zt4u5"
                                    >
                                        Product Name (Arabic)
                                    </h4>
                                    <p className="text-gray-600" data-oid="diuwh_:">
                                        {product.nameAr}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="gieg5wn"
                            >
                                <div data-oid="886vdqt">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="mixz.cf"
                                    >
                                        Manufacturer
                                    </h4>
                                    <p className="text-gray-600" data-oid="io-2ub6">
                                        {product.manufacturer}
                                    </p>
                                </div>
                                <div data-oid="8yyv0q1">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="ke3ic-5"
                                    >
                                        Barcode
                                    </h4>
                                    <p className="text-gray-600" data-oid="2i77psz">
                                        {product.barcode || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div data-oid="vrm36ys">
                                <h4 className="font-medium text-gray-900 mb-1" data-oid="y8k02-m">
                                    Description (English)
                                </h4>
                                <p className="text-gray-600" data-oid="_vruivc">
                                    {product.description}
                                </p>
                            </div>

                            <div data-oid="gb7u4r0">
                                <h4 className="font-medium text-gray-900 mb-1" data-oid="ee-geq5">
                                    Description (Arabic)
                                </h4>
                                <p className="text-gray-600" data-oid="pj2.hx4">
                                    {product.descriptionAr}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="pfal.rl">
                        <CardHeader data-oid="u:sto6t">
                            <CardTitle className="text-gray-800" data-oid=":kt3-j2">
                                Medical Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" data-oid="8-3rkzn">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="mr46796"
                            >
                                <div data-oid="c51_rrn">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="cdf4tgb"
                                    >
                                        Active Ingredient
                                    </h4>
                                    <p className="text-gray-600" data-oid="2f:nua1">
                                        {product.activeIngredient}
                                    </p>
                                </div>
                                <div data-oid="4kh-yfv">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="0k0gzko"
                                    >
                                        Dosage
                                    </h4>
                                    <p className="text-gray-600" data-oid="9wsums1">
                                        {product.dosage}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="361pg2o"
                            >
                                <div data-oid="30dz28r">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="vtlxxb-"
                                    >
                                        Form
                                    </h4>
                                    <p className="text-gray-600" data-oid="8cnaob6">
                                        {product.form}
                                    </p>
                                </div>
                                <div data-oid="_e1:soj">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="lkxg6ka"
                                    >
                                        Pack Size
                                    </h4>
                                    <p className="text-gray-600" data-oid="r0v8r-l">
                                        {product.packSize}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="ikxa7ua"
                            >
                                <div data-oid="c8m:nx.">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid=".y3a0_l"
                                    >
                                        Unit
                                    </h4>
                                    <p className="text-gray-600" data-oid="l53elp-">
                                        {product.unit}
                                    </p>
                                </div>
                                <div data-oid="-f4jp-z">
                                    <h4
                                        className="font-medium text-gray-900 mb-1"
                                        data-oid="t25qklb"
                                    >
                                        Registration Number
                                    </h4>
                                    <p className="text-gray-600" data-oid="l:ogb6o">
                                        {product.registrationNumber || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="oucrvoe">
                        <CardHeader data-oid="do4q06x">
                            <CardTitle className="text-gray-800" data-oid=".xbh.go">
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" data-oid="6gbt-ag">
                            <div data-oid="blie9rr">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="ii591:d">
                                    Tags
                                </h4>
                                <div className="flex flex-wrap gap-2" data-oid="k0j-vj9">
                                    {product.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs"
                                            data-oid="paipd4s"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div data-oid="de1az31">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="98_2de9">
                                    Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2" data-oid="pfm:gcb">
                                    {product.keywords.map((keyword, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs bg-gray-50"
                                            data-oid="j33smjh"
                                        >
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6" data-oid="kdxqv00">
                    <Card data-oid="97nis8f">
                        <CardHeader data-oid="mwuaxxc">
                            <CardTitle className="text-gray-800" data-oid="4i4g96d">
                                Product Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="ld-w3u1">
                            {(product.images && product.images.length > 0) ? (
                                <div
                                    className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"
                                    data-oid="i-4fjbo"
                                >
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        data-oid="ksv4g9e"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center"
                                    data-oid="o1m6e7p"
                                >
                                    <div className="text-center" data-oid="-wv:5vn">
                                        <svg
                                            className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="3c6.f60"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                data-oid="3ch5ag9"
                                            />
                                        </svg>
                                        <p className="text-gray-500 text-sm" data-oid="ln4:nqg">
                                            No image available
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card data-oid="403namr">
                        <CardHeader data-oid="9bg83uo">
                            <CardTitle className="text-gray-800" data-oid="osimzkm">
                                Classification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" data-oid="1.q1f7x">
                            <div data-oid="52_8o19">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="sng7qie">
                                    Category
                                </h4>
                                <Badge
                                    className="bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20"
                                    data-oid="ukw3kba"
                                >
                                    {product.category.charAt(0).toUpperCase() +
                                        product.category.slice(1)}
                                </Badge>
                            </div>

                            <div data-oid="l868ke7">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="1p-7p66">
                                    Type
                                </h4>
                                {getTypeBadge(product.type)}
                            </div>

                            <div data-oid="ded_gi2">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="caluomg">
                                    Regulatory Status
                                </h4>
                                <Badge variant="outline" className="capitalize" data-oid="rt8_ieb">
                                    {product.regulatoryStatus}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="u0ajn7.">
                        <CardHeader data-oid="-yxg83c">
                            <CardTitle className="text-gray-800" data-oid="sn9-mjo">
                                Permissions & Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" data-oid="yb4civ_">
                            <div data-oid="fw0z3gr">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="ym5l77m">
                                    Prescription Required
                                </h4>
                                {product.prescriptionRequired ? (
                                    <Badge
                                        className="bg-[#14274E]/10 text-[#14274E] border border-[#14274E]/20"
                                        data-oid="pxo-nvk"
                                    >
                                        Required
                                    </Badge>
                                ) : (
                                    <Badge
                                        className="bg-gray-100 text-gray-600 border border-gray-200"
                                        data-oid="v:q1v8y"
                                    >
                                        Not Required
                                    </Badge>
                                )}
                            </div>

                            <div data-oid="b9b8v_d">
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="dgm::xe">
                                    Eligibility
                                </h4>
                                {getEligibilityBadge(product)}
                            </div>

                            <div className="pt-2 border-t" data-oid="04th39-">
                                <div className="space-y-2 text-sm" data-oid="5vjqnt6">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="8v_-t-s"
                                    >
                                        <span className="text-gray-600" data-oid="j6dvrcj">
                                            Pharmacy Eligible:
                                        </span>
                                        <span
                                            className={
                                                product.pharmacyEligible
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }
                                            data-oid="f.mwb2x"
                                        >
                                            {product.pharmacyEligible ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="aqapbe_"
                                    >
                                        <span className="text-gray-600" data-oid="ke0k8mf">
                                            Vendor Eligible:
                                        </span>
                                        <span
                                            className={
                                                product.vendorEligible
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }
                                            data-oid="ol:kmc1"
                                        >
                                            {product.vendorEligible ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="_q07j_j">
                        <CardHeader data-oid="fxji3l-">
                            <CardTitle className="text-gray-800" data-oid="kg6lt5n">
                                Timestamps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3" data-oid="1oodpug">
                            <div data-oid="7ap4032">
                                <h4 className="font-medium text-gray-900 mb-1" data-oid="uaj9lbd">
                                    Created At
                                </h4>
                                <p className="text-gray-600 text-sm" data-oid="d29yn34">
                                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <div data-oid="mfosv4:">
                                <h4 className="font-medium text-gray-900 mb-1" data-oid="nu:_rco">
                                    Updated At
                                </h4>
                                <p className="text-gray-600 text-sm" data-oid="vpn1.2x">
                                    {new Date(product.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
