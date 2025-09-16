'use client';
interface Pharmacy {
    id: string;
    name: string;
    address: string | {
        street?: string;
        area?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    phone: string;
    cityName: string;
    deliveryTime: string;
    deliveryFee: number;
    isActive: boolean;
    workingHours: {
        open: string;
        close: string;
        is24Hours: boolean;
    };
    specialties?: string[];
    isVerified?: boolean;
    email?: string;
    inventory?: {
        productId: string;
        productName: string;
        price: number;
        inStock: boolean;
        stockQuantity: number;
    }[];
    productStatistics?: {
        Inventory: {
            productId: string;
            productName?: string;
            price: number;
            inStock: boolean;
            stockQuantity: number;
        }[];
    };
}
interface Product {
    productId: string;
    quantity: number;
    unitType: string;
    name?: string;
    price?: number;
    packSize?: string;
    image?: string;
}
interface EnhancedPharmacySelectorProps {
    product: Product;
    productIndex: number;
    pharmacies: Pharmacy[];
    selectedPharmacyId?: string;
    onPharmacySelect: (pharmacyId: string) => void;
    onTotalCalculated?: (total: number) => void;
}
export function EnhancedPharmacySelector({
    product,
    productIndex,
    pharmacies,
    selectedPharmacyId,
    onPharmacySelect,
    onTotalCalculated,
}: EnhancedPharmacySelectorProps) {
    console.log('All pharmacies:', pharmacies);
    
    // Filter pharmacies that have this product in stock
    const availablePharmacies = pharmacies.filter(pharmacy => {
        // Check if pharmacy has productStatistics with Inventory
        if (!pharmacy.productStatistics?.Inventory) {
            return false;
        }
        
        // Check if the product is available in this pharmacy's inventory
        const hasProduct = pharmacy.productStatistics.Inventory.some((item: any) => 
            item.productId._id === product.productId && item.inStock && item.stockQuantity > 0
        );
        
        console.log(`Pharmacy ${pharmacy.name} has product ${product.name}:`, hasProduct);
        return hasProduct;
    });
    
    console.log(`Filtered ${availablePharmacies.length} pharmacies for product ${product.name}`);
    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            data-oid="g2_notz"
        >
            {' '}
            {/* Product Header */}{' '}
            <div
                className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 p-4"
                data-oid="uf2e0aa"
            >
                {' '}
                <div className="flex items-start gap-4" data-oid="eke3dz-">
                    {' '}
                    {/* Product Image */}{' '}
                    <div
                        className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0"
                        data-oid="2_qvfo:"
                    >
                        {' '}
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                                data-oid="k5c6i0."
                            />
                        ) : null}{' '}
                        <div
                            className="w-full h-full bg-gradient-to-br from-[#1F1F6F] to-[#14274E] flex items-center justify-center"
                            data-oid="rm0yw54"
                        >
                            {' '}
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="_1j5s_3"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    data-oid="evofq3w"
                                />{' '}
                            </svg>{' '}
                        </div>{' '}
                    </div>{' '}
                    {/* Product Info */}{' '}
                    <div className="flex-1" data-oid="_3ls.sn">
                        {' '}
                        <div className="flex items-center gap-3 mb-2" data-oid="onyd:5a">
                            {' '}
                            <h5 className="text-xl font-bold text-gray-900" data-oid="ql-a7xs">
                                {' '}
                                {product.name || 'Unknown Product'}{' '}
                            </h5>{' '}
                            {selectedPharmacyId && (
                                <span
                                    className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                                    data-oid="490surn"
                                >
                                    {' '}
                                    ✓ Pharmacy Selected{' '}
                                </span>
                            )}{' '}
                        </div>{' '}
                        <div
                            className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"
                            data-oid="2f:lyat"
                        >
                            {' '}
                            <div data-oid="f3.hq7o">
                                {' '}
                                <span className="text-gray-500" data-oid="z9-g4dk">
                                    Quantity:{' '}
                                </span>{' '}
                                <span className="font-medium" data-oid="80oin::">
                                    {' '}
                                    {product.quantity} {product.unitType}{' '}
                                    {product.quantity > 1 ? 'es' : ''}{' '}
                                </span>{' '}
                            </div>{' '}
                            {(() => {
                                // Find the selected pharmacy's inventory for this product
                                const selectedPharmacy = pharmacies.find(p => p.id === selectedPharmacyId);
                                const productInventory = selectedPharmacy?.productStatistics?.Inventory?.find(
                                    (item: any) => item.productId._id == product.productId
                                );
                                console.log(selectedPharmacy?.productStatistics?.Inventory)
                                console.log(productInventory)
                                const displayPrice = productInventory?.price;
                                console.log('display price', displayPrice, product.productId)
                                return displayPrice && (
                                    <>
                                        {' '}
                                        <div data-oid="5jwzd8p">
                                            {' '}
                                            <span className="text-gray-500" data-oid="puq4m78">
                                                Unit Price:{' '}
                                            </span>{' '}
                                            <span className="font-medium" data-oid="v8jlp.i">
                                                {' '}
                                                {displayPrice} EGP per {product.unitType}{' '}
                                            </span>{' '}
                                        </div>{' '}
                                        <div data-oid="cbwnsx.">
                                            {' '}
                                            <span className="text-gray-500" data-oid="3iitcgc">
                                                Pack Size:{' '}
                                            </span>{' '}
                                            <span className="font-medium" data-oid="nt66l3g">
                                                {' '}
                                                {product.packSize || 'N/A'}{' '}
                                            </span>{' '}
                                        </div>{' '}
                                    </>
                                );
                            })()}{' }'}
                        </div>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
            {/* Pharmacy Selection */}{' '}
            <div className="p-4" data-oid="hq.:mw4">
                {' '}
                <div className="flex items-center justify-between mb-4" data-oid="12hn90p">
                    {' '}
                    <h6 className="text-lg font-semibold text-gray-900" data-oid="3k50f4n">
                        {' '}
                        Choose Pharmacy{' '}
                    </h6>{' '}
                    <span
                        className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                        data-oid="az4tsq7"
                    >
                        {' '}
                        {availablePharmacies.length} available{' '}
                    </span>{' '}
                </div>{' '}
                <div className="space-y-3 max-h-60 overflow-y-auto" data-oid="6bworr2">
                    {' '}
                    {availablePharmacies.map((pharmacy) => (
                        <div
                            key={pharmacy.id}
                            className={`border rounded-lg transition-all duration-200 cursor-pointer ${selectedPharmacyId === pharmacy.id ? 'border-[#1F1F6F] bg-[#1F1F6F]/5 ring-2 ring-[#1F1F6F]/20' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => onPharmacySelect(pharmacy.id)}
                            data-oid="3ggmavn"
                        >
                            {' '}
                            <div className="p-4" data-oid="hsg03qe">
                                {' '}
                                <div
                                    className="flex items-start justify-between"
                                    data-oid="zq88pn0"
                                >
                                    {' '}
                                    <div className="flex items-start space-x-3" data-oid="om.uz0q">
                                        {' '}
                                        <input
                                            type="radio"
                                            checked={selectedPharmacyId === pharmacy.id}
                                            onChange={() => onPharmacySelect(pharmacy.id)}
                                            className="w-4 h-4 text-[#1F1F6F] focus:ring-[#1F1F6F] mt-1"
                                            data-oid="9ujd7dh"
                                        />{' '}
                                        <div className="flex-1" data-oid="7.4vt_3">
                                            {' '}
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="7j1hu4h"
                                            >
                                                {' '}
                                                <h4
                                                    className="font-semibold text-gray-900"
                                                    data-oid="s_2a-77"
                                                >
                                                    {' '}
                                                    {pharmacy.name}{' '}
                                                </h4>{' '}
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${pharmacy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                    data-oid="6kl8ekp"
                                                >
                                                    {' '}
                                                    {pharmacy ? 'Open' : 'Closed'}{' '}
                                                </span>{' '}
                                            </div>{' '}
                                            {/* Product Price at this Pharmacy */}
                                            {(() => {
                                                const productInInventory = pharmacy.productStatistics?.Inventory?.find((item: any) => 
                                                    item.productId._id == product.productId
                                                );
                                                return productInInventory ? (
                                                    <div className="mt-2 mb-2">
                                                        <span className="text-lg font-bold text-[#1F1F6F]">
                                                            {productInInventory.price} EGP
                                                        </span>
                                                        <span className="text-sm text-gray-500 ml-1">per box</span>
                                                        <span className="text-xs text-green-600 ml-2">
                                                            {productInInventory.stockQuantity} in stock
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })()}
                                            <div
                                                className="flex items-center space-x-4 mt-1 text-sm text-gray-600"
                                                data-oid="dd2w_sa"
                                            >
                                                {' '}
                                                <span
                                                    className="flex items-center gap-1"
                                                    data-oid="i02em-v"
                                                >
                                                    {' '}
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="lcnz8r8"
                                                    >
                                                        {' '}
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                            data-oid="oy9zvrz"
                                                        />{' '}
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                            data-oid="whltimy"
                                                        />{' '}
                                                    </svg>{' '}
                                                    {pharmacy.cityName}{' '}
                                                </span>{' '}
                                                <span
                                                    className="flex items-center gap-1"
                                                    data-oid="22n6hhq"
                                                >
                                                    {' '}
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="j0qjfnb"
                                                    >
                                                        {' '}
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                            data-oid="c-6o-wa"
                                                        />{' '}
                                                    </svg>{' '}
                                                    {pharmacy.deliveryTime}{' '}
                                                </span>{' '}
                                            </div>{' '}
                                        </div>{' '}
                                    </div>{' '}
                                </div>{' '}
                                {/* Expanded Details for Selected Pharmacy */}{' '}
                                {selectedPharmacyId === pharmacy.id && (
                                    <div
                                        className="border-t border-gray-200 mt-4 pt-4 bg-gray-50 -mx-4 -mb-4 px-4 pb-4"
                                        data-oid="976msw5"
                                    >
                                        {' '}
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            data-oid="tfd854f"
                                        >
                                            {' '}
                                            {/* Contact Information */}{' '}
                                            <div data-oid="mo73pt1">
                                                {' '}
                                                <h5
                                                    className="font-medium text-gray-900 mb-2"
                                                    data-oid="bjj-mde"
                                                >
                                                    {' '}
                                                    Contact Information{' '}
                                                </h5>{' '}
                                                <div
                                                    className="space-y-1 text-sm text-gray-600"
                                                    data-oid="02zlxxi"
                                                >
                                                    {' '}
                                                    <p
                                                        className="flex items-center gap-2"
                                                        data-oid="4gyuhu4"
                                                    >
                                                        {' '}
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="_k_o_fq"
                                                        >
                                                            {' '}
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                data-oid="bd0sfbj"
                                                            />{' '}
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                data-oid="42ib3y."
                                                            />{' '}
                                                        </svg>{' '}
                                                        {typeof pharmacy.address === 'string' 
                                                            ? pharmacy.address 
                                                            : `${pharmacy.address?.street || ''}, ${pharmacy.address?.city || ''}`}{' '}
                                                    </p>{' '}
                                                    <p
                                                        className="flex items-center gap-2"
                                                        data-oid="20ubl5y"
                                                    >
                                                        {' '}
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="7ovet50"
                                                        >
                                                            {' '}
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                data-oid="l0lqme6"
                                                            />{' '}
                                                        </svg>{' '}
                                                        {pharmacy.phone}{' '}
                                                    </p>{' '}
                                                    <p
                                                        className="flex items-center gap-2"
                                                        data-oid=":p2qw8_"
                                                    >
                                                        {' '}
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="q4xedmd"
                                                        >
                                                            {' '}
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                data-oid="l6ryy0e"
                                                            />{' '}
                                                        </svg>{' '}
                                                        {pharmacy.workingHours.is24Hours
                                                            ? '24 Hours'
                                                            : `${pharmacy.workingHours.open} - ${pharmacy.workingHours.close}`}{' '}
                                                    </p>{' '}
                                                </div>{' '}
                                            </div>{' '}
                                            {/* Product Pricing */}{' '}
                                            <div data-oid="dpbstbz">
                                                {' '}
                                                <h5
                                                    className="font-medium text-gray-900 mb-2"
                                                    data-oid="gyyit11"
                                                >
                                                    {' '}
                                                    Product Total{' '}
                                                </h5>{' '}
                                                <div
                                                    className="space-y-1 text-sm"
                                                    data-oid="ypgkgcl"
                                                >
                                                    {' '}
                                                    {(() => {
                                                        const productInInventory = pharmacy.productStatistics?.Inventory?.find((item: any) => 
                                                            item.productId._id == product.productId
                                                        );
                                                        const pharmacyPrice = productInInventory?.price || product.price || 0;
                                                        
                                                        return (
                                                            <div
                                                                className="flex justify-between"
                                                                data-oid="xd_0u5d"
                                                            >
                                                                {' '}
                                                                <span
                                                                    className="text-gray-600"
                                                                    data-oid="8ipari1"
                                                                >
                                                                    {' '}
                                                                    {product.quantity} ×{' '}
                                                                    {pharmacyPrice} EGP{' '}
                                                                </span>{' '}
                                                                <span
                                                                    className="font-medium text-gray-900"
                                                                    data-oid="i0ykqhr"
                                                                >
                                                                    {' '}
                                                                    {(pharmacyPrice * product.quantity).toFixed(2)}{' '}
                                                                    EGP{' '}
                                                                </span>{' '}
                                                            </div>
                                                        );
                                                    })()}{' }'}
                                                    <div
                                                        className="flex justify-between"
                                                        data-oid="37on6o6"
                                                    >
                                                        {' '}
                                                        <span
                                                            className="text-gray-600"
                                                            data-oid="v1_hlnv"
                                                        >
                                                            Delivery Fee
                                                        </span>{' '}
                                                        <span
                                                            className="font-medium text-gray-900"
                                                            data-oid="c.5barj"
                                                        >
                                                            {' '}
                                                            {pharmacy.deliveryFee.toFixed(2)}{' '}
                                                            EGP{' '}
                                                        </span>{' '}
                                                    </div>{' '}
                                                    <div
                                                        className="flex justify-between border-t pt-1"
                                                        data-oid="zwzkp_1"
                                                    >
                                                        {' '}
                                                        <span
                                                            className="font-semibold text-gray-900"
                                                            data-oid="s1pc_2w"
                                                        >
                                                            Total
                                                        </span>{' '}
                                                        {(() => {
                                                            const productInInventory = pharmacy.productStatistics?.Inventory?.find((item: any) => 
                                                                item.productId._id == product.productId
                                                            );
                                                            const pharmacyPrice = productInInventory?.price || product.price || 0;
                                                            const total = (pharmacyPrice * product.quantity) + pharmacy.deliveryFee;
                                                            
                                                            // Call the callback with calculated total
                                                            if (selectedPharmacyId === pharmacy.id && onTotalCalculated) {
                                                                onTotalCalculated(total);
                                                            }
                                                            
                                                            return (
                                                                <span
                                                                    className="font-bold text-[#1F1F6F]"
                                                                    data-oid="98opw.6"
                                                                >
                                                                    {' '}
                                                                    {total.toFixed(2)}{' '}
                                                                    EGP{' '}
                                                                </span>
                                                            );
                                                        })()}{' }'}
                                                    </div>{' '}
                                                </div>{' '}
                                            </div>{' '}
                                        </div>{' '}
                                    </div>
                                )}{' '}
                            </div>{' '}
                        </div>
                    ))}{' '}
                </div>{' '}
                {availablePharmacies.length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-oid="mqyah.l">
                        {' '}
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="nq9t.pk"
                        >
                            {' '}
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="n58801b"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    data-oid="gnx-rwt"
                                />{' '}
                            </svg>{' '}
                        </div>{' '}
                        <p className="text-lg font-medium" data-oid="mdiwe:v">
                            No Pharmacies Available
                        </p>{' '}
                        <p className="text-sm" data-oid="m33bxa-">
                            {' '}
                            No active pharmacies found in the system.{' '}
                        </p>{' '}
                    </div>
                )}{' '}
            </div>{' '}
        </div>
    );
}
