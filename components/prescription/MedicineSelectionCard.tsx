'use client';

import { useState } from 'react';
import { MedicineDataManager, ExtendedMedicine } from '@/lib/data/medicineData';
import { Product } from '@/lib/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlternativeMedicineSelector } from './AlternativeMedicineSelector';
import { MedicineSearchModal } from './MedicineSearchModal';

interface ProcessedMedicine {
    id: string;
    medicineId: string;
    medicineName: string;
    selectedAlternative?: ExtendedMedicine;
    dosage: string;
    frequency: string; // Added: How often to take
    duration: string;  // Added: How long to take
    instructions: string;
    quantity: number;
    price: number;
    notes?: string;
    selectedProduct?: Product;
    image?: string;
    manufacturer?: string;
    activeIngredient?: string;
    form?: string;
    strength?: string;
}

interface MedicineSelectionCardProps {
    medicine: ProcessedMedicine;
    index: number;
    onUpdate: (updates: Partial<ProcessedMedicine>) => void;
    onRemove: () => void;
    onSelectAlternative: (alternative: ExtendedMedicine | null) => void;
}

export function MedicineSelectionCard({
    medicine,
    index,
    onUpdate,
    onRemove,
    onSelectAlternative,
}: MedicineSelectionCardProps) {
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const handleMedicineSelect = (selectedItem: ExtendedMedicine | Product) => {
        if ('pharmacyMapping' in selectedItem) {
            // It's an ExtendedMedicine
            onUpdate({
                medicineId: selectedItem.id,
                medicineName: selectedItem.name,
                dosage: selectedItem.strength,
                price: selectedItem.pharmacyMapping.averagePrice,
                image: selectedItem.image,
                manufacturer: selectedItem.manufacturer,
                activeIngredient: selectedItem.activeIngredient,
                form: selectedItem.form,
                strength: selectedItem.strength,
            });
        } else {
            // It's a Product
            onUpdate({
                medicineId: selectedItem.id.toString(),
                medicineName: selectedItem.name,
                dosage: selectedItem.dosage || '',
                price: selectedItem.price,
                selectedProduct: selectedItem,
                image: selectedItem.image,
                manufacturer: selectedItem.manufacturer,
                activeIngredient: selectedItem.activeIngredient,
                form: selectedItem.packSize,
                strength: selectedItem.dosage || '',
            });
        }
        setShowSearchModal(false);
    };

    const selectedMedicineData = medicine.medicineId
        ? MedicineDataManager.getMedicineById(medicine.medicineId)
        : null;

    const displayMedicine = medicine.selectedAlternative || selectedMedicineData;

    return (
        <>
            <Card className="border-l-4 border-l-[#1F1F6F] shadow-lg" data-oid="wvrtmw_">
                <CardHeader
                    className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5"
                    data-oid="ic:06st"
                >
                    <CardTitle className="flex items-center justify-between" data-oid="e_j94gg">
                        <div className="flex items-center space-x-3" data-oid="f::uzqw">
                            <span className="text-lg font-bold text-[#1F1F6F]" data-oid="1y8cnrk">
                                💊 Medicine {index + 1}
                            </span>
                            {medicine.selectedAlternative && (
                                <Badge
                                    variant="outline"
                                    className="text-blue-600 border-blue-600 bg-blue-50"
                                    data-oid="_k5jx0o"
                                >
                                    🔄 Alternative Selected
                                </Badge>
                            )}
                            {medicine.selectedProduct && (
                                <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-600 bg-green-50"
                                    data-oid="8t_12mq"
                                >
                                    🛒 Product Selected
                                </Badge>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRemove}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            data-oid="nare0gk"
                        >
                            🗑️ Remove
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6" data-oid="-_7i6z:">
                    {/* Medicine Selection */}
                    <div className="space-y-4" data-oid="ht.3au1">
                        <Label className="text-base font-semibold text-gray-900" data-oid="b::tx8m">
                            🔍 Select Medicine/Product
                        </Label>

                        {!medicine.medicineId ? (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
                                data-oid="-v1y-3p"
                            >
                                <div
                                    className="w-16 h-16 bg-[#1F1F6F]/10 rounded-full flex items-center justify-center mx-auto mb-4"
                                    data-oid="39-msdq"
                                >
                                    <span className="text-2xl" data-oid="06.g.lb">
                                        💊
                                    </span>
                                </div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="x:b9mge"
                                >
                                    No Medicine Selected
                                </h3>
                                <p className="text-gray-600 mb-4" data-oid="3kz5fp4">
                                    Search our comprehensive database to find the perfect medicine
                                </p>
                                <Button
                                    onClick={() => setShowSearchModal(true)}
                                    className="bg-[#1F1F6F] hover:bg-[#14274E] text-white"
                                    data-oid="1p3650u"
                                >
                                    🔍 Browse Medicine Database
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                                data-oid="ui8d0ft"
                            >
                                <div className="flex items-start space-x-4" data-oid="kiszd1p">
                                    {/* Medicine Image */}
                                    <div
                                        className="w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden"
                                        data-oid="2yb77oa"
                                    >
                                        {medicine.image &&
                                        medicine.image !== '/api/placeholder/300/300' ? (
                                            <img
                                                src={medicine.image}
                                                alt={medicine.medicineName}
                                                className="w-full h-full object-cover rounded-lg"
                                                data-oid=":u4x6me"
                                            />
                                        ) : (
                                            <div className="text-2xl" data-oid="t9b4ao.">
                                                💊
                                            </div>
                                        )}
                                    </div>

                                    {/* Medicine Details */}
                                    <div className="flex-1" data-oid="17ef295">
                                        <div
                                            className="flex items-start justify-between"
                                            data-oid="iztyuc6"
                                        >
                                            <div data-oid="58s4lio">
                                                <h4
                                                    className="font-bold text-gray-900 text-lg"
                                                    data-oid="ms2:fe8"
                                                >
                                                    {medicine.medicineName}
                                                </h4>
                                                {medicine.manufacturer && (
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="6m-y.g1"
                                                    >
                                                        🏭 {medicine.manufacturer}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowSearchModal(true)}
                                                className="text-[#1F1F6F] border-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white"
                                                data-oid="o.m_8q-"
                                            >
                                                🔄 Change
                                            </Button>
                                        </div>

                                        <div
                                            className="grid grid-cols-2 gap-3 mt-3 text-sm"
                                            data-oid=":-lmby3"
                                        >
                                            {medicine.strength && (
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="q121b_6"
                                                >
                                                    <span
                                                        className="text-gray-500"
                                                        data-oid="z0i__3c"
                                                    >
                                                        💪 Strength:
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="k26cjhk"
                                                    >
                                                        {medicine.strength}
                                                    </span>
                                                </div>
                                            )}
                                            {medicine.form && (
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="xa0w5-g"
                                                >
                                                    <span
                                                        className="text-gray-500"
                                                        data-oid="k3-ncxh"
                                                    >
                                                        📋 Form:
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="drtj1qm"
                                                    >
                                                        {medicine.form}
                                                    </span>
                                                </div>
                                            )}
                                            {medicine.activeIngredient && (
                                                <div
                                                    className="flex items-center space-x-2 col-span-2"
                                                    data-oid="dc6fh6r"
                                                >
                                                    <span
                                                        className="text-gray-500"
                                                        data-oid="h7.628b"
                                                    >
                                                        🧪 Active:
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="oo0s03j"
                                                    >
                                                        {medicine.activeIngredient}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className="mt-3 flex items-center justify-between"
                                            data-oid="-udg.p3"
                                        >
                                            <div
                                                className="text-lg font-bold text-[#1F1F6F]"
                                                data-oid="5:owlpa"
                                            >
                                                💰 EGP {medicine.price.toFixed(2)}
                                            </div>
                                            {medicine.selectedProduct && (
                                                <Badge
                                                    className="bg-green-100 text-green-800"
                                                    data-oid="4v1f53l"
                                                >
                                                    🛒 From Product Database
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alternative Medicine Selection */}
                    {selectedMedicineData && selectedMedicineData.alternatives.length > 0 && (
                        <div className="space-y-4" data-oid="cnj4qgv">
                            <div className="flex items-center justify-between" data-oid="fdbj6o.">
                                <Label
                                    className="text-base font-semibold text-gray-900"
                                    data-oid="d:iw403"
                                >
                                    🔄 Alternative Medicines
                                </Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAlternatives(!showAlternatives)}
                                    className="text-[#1F1F6F] border-[#1F1F6F]"
                                    data-oid="kwm:qmu"
                                >
                                    {showAlternatives ? '👁️ Hide' : '👁️ Show'} Alternatives
                                </Button>
                            </div>

                            {showAlternatives && (
                                <AlternativeMedicineSelector
                                    originalMedicine={selectedMedicineData}
                                    selectedAlternative={medicine.selectedAlternative}
                                    onSelectAlternative={onSelectAlternative}
                                    data-oid="iy52.b9"
                                />
                            )}
                        </div>
                    )}

                    <Separator className="my-6" data-oid="nobfj4b" />

                    {/* Medicine Configuration */}
                    <div className="space-y-6" data-oid="04ueugy">
                        <h3
                            className="text-lg font-semibold text-gray-900 flex items-center"
                            data-oid="cidc56c"
                        >
                            ⚙️ Medicine Configuration
                        </h3>

                        <div className="grid grid-cols-2 gap-4" data-oid="9nz9uka">
                            <div data-oid="ixxo_mj">
                                <Label
                                    htmlFor={`dosage-${medicine.id}`}
                                    className="flex items-center space-x-2"
                                    data-oid="2o.m95p"
                                >
                                    <span data-oid="1o0futf">💊</span>
                                    <span data-oid="ukaed9e">Dosage</span>
                                </Label>
                                <Input
                                    id={`dosage-${medicine.id}`}
                                    value={medicine.dosage}
                                    onChange={(e) => onUpdate({ dosage: e.target.value })}
                                    placeholder="e.g., 500mg"
                                    className="mt-1"
                                    data-oid="3ciq4az"
                                />
                            </div>
                            <div data-oid="btq4ra4">
                                <Label
                                    htmlFor={`quantity-${medicine.id}`}
                                    className="flex items-center space-x-2"
                                    data-oid="3l3c:t7"
                                >
                                    <span data-oid="i2gsuru">🔢</span>
                                    <span data-oid="weq8qy0">Quantity</span>
                                </Label>
                                <Input
                                    id={`quantity-${medicine.id}`}
                                    type="number"
                                    min="1"
                                    value={medicine.quantity}
                                    onChange={(e) =>
                                        onUpdate({ quantity: parseInt(e.target.value) || 1 })
                                    }
                                    className="mt-1"
                                    data-oid="nn0w42g"
                                />
                            </div>
                        </div>

                        {/* New Frequency and Duration Fields */}
                        <div className="grid grid-cols-2 gap-4" data-oid="freq-dur-grid">
                            <div data-oid="freq-field">
                                <Label
                                    htmlFor={`frequency-${medicine.id}`}
                                    className="flex items-center space-x-2"
                                    data-oid="freq-label"
                                >
                                    <span data-oid="freq-emoji">⏰</span>
                                    <span data-oid="freq-text">Frequency *</span>
                                </Label>
                                <Input
                                    id={`frequency-${medicine.id}`}
                                    value={medicine.frequency || ''}
                                    onChange={(e) => onUpdate({ frequency: e.target.value })}
                                    placeholder="e.g., 3 times daily, Every 8 hours"
                                    className="mt-1"
                                    data-oid="freq-input"
                                />
                            </div>
                            <div data-oid="dur-field">
                                <Label
                                    htmlFor={`duration-${medicine.id}`}
                                    className="flex items-center space-x-2"
                                    data-oid="dur-label"
                                >
                                    <span data-oid="dur-emoji">📅</span>
                                    <span data-oid="dur-text">Duration *</span>
                                </Label>
                                <Input
                                    id={`duration-${medicine.id}`}
                                    value={medicine.duration || ''}
                                    onChange={(e) => onUpdate({ duration: e.target.value })}
                                    placeholder="e.g., 7 days, 2 weeks"
                                    className="mt-1"
                                    data-oid="dur-input"
                                />
                            </div>
                        </div>

                        <div data-oid="buxg8kp">
                            <Label
                                htmlFor={`price-${medicine.id}`}
                                className="flex items-center space-x-2"
                                data-oid=".xpmfxf"
                            >
                                <span data-oid="70jqx0m">💰</span>
                                <span data-oid="o08bucc">Price (EGP)</span>
                            </Label>
                            <Input
                                id={`price-${medicine.id}`}
                                type="number"
                                step="0.01"
                                value={medicine.price}
                                onChange={(e) =>
                                    onUpdate({ price: parseFloat(e.target.value) || 0 })
                                }
                                className="mt-1"
                                data-oid=".uljp:j"
                            />
                        </div>

                        <div data-oid="4wqumbd">
                            <Label
                                htmlFor={`instructions-${medicine.id}`}
                                className="flex items-center space-x-2"
                                data-oid="--c6wgv"
                            >
                                <span data-oid="jymlszl">📝</span>
                                <span data-oid="mg3dj4l">Instructions *</span>
                            </Label>
                            <Textarea
                                id={`instructions-${medicine.id}`}
                                value={medicine.instructions}
                                onChange={(e) => onUpdate({ instructions: e.target.value })}
                                placeholder="e.g., Take 1 tablet twice daily after meals"
                                rows={3}
                                className="mt-1"
                                data-oid=":okdsb4"
                            />
                        </div>

                        <div data-oid="vqvifvk">
                            <Label
                                htmlFor={`notes-${medicine.id}`}
                                className="flex items-center space-x-2"
                                data-oid="8m.500j"
                            >
                                <span data-oid="n98k90o">📋</span>
                                <span data-oid="5ra:u5a">Additional Notes</span>
                            </Label>
                            <Textarea
                                id={`notes-${medicine.id}`}
                                value={medicine.notes || ''}
                                onChange={(e) => onUpdate({ notes: e.target.value })}
                                placeholder="Any additional notes for this medicine..."
                                rows={2}
                                className="mt-1"
                                data-oid="nf54co_"
                            />
                        </div>
                    </div>

                    {/* Medicine Information Display */}
                    {(displayMedicine || medicine.selectedProduct) && (
                        <div
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                            data-oid="xqg9o0p"
                        >
                            <h5
                                className="font-bold text-blue-900 mb-4 flex items-center"
                                data-oid="jc4dml8"
                            >
                                <span className="text-xl mr-2" data-oid="iyh5ii9">
                                    ℹ️
                                </span>
                                Medicine Information
                            </h5>
                            <div className="grid grid-cols-2 gap-4 text-sm" data-oid="cld1u-p">
                                {displayMedicine && (
                                    <>
                                        <div data-oid="oc3.yl0">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="o6_w-fh"
                                            >
                                                📂 Category:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="-4_kqzb"
                                            >
                                                {displayMedicine.category}
                                            </p>
                                        </div>
                                        <div data-oid="nv6p4vq">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="_f2we-w"
                                            >
                                                🧪 Active Ingredient:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="4-o6fbx"
                                            >
                                                {displayMedicine.activeIngredient}
                                            </p>
                                        </div>
                                        <div data-oid="cj5oc72">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="cge42xi"
                                            >
                                                🏥 Therapeutic Class:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="oh90fl2"
                                            >
                                                {displayMedicine.therapeuticClass}
                                            </p>
                                        </div>
                                        <div data-oid="_lq04cc">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="mo7bpho"
                                            >
                                                📋 Requires Prescription:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="z:9xouu"
                                            >
                                                {displayMedicine.requiresPrescription
                                                    ? '✅ Yes'
                                                    : '❌ No'}
                                            </p>
                                        </div>
                                    </>
                                )}
                                {medicine.selectedProduct && (
                                    <>
                                        <div data-oid="iqu45pr">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="y_tyje."
                                            >
                                                🏪 Pharmacy:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="ab._nu3"
                                            >
                                                {medicine.selectedProduct.pharmacy}
                                            </p>
                                        </div>
                                        <div data-oid="eovw5:4">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="e2yt.31"
                                            >
                                                📦 Pack Size:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="xzp0gik"
                                            >
                                                {medicine.selectedProduct.packSize}
                                            </p>
                                        </div>
                                        <div data-oid="bgawa44">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="_i6t9m0"
                                            >
                                                ⭐ Rating:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="p96zfo1"
                                            >
                                                {medicine.selectedProduct.rating}/5
                                            </p>
                                        </div>
                                        <div data-oid="e6u_0lq">
                                            <span
                                                className="text-blue-700 font-medium"
                                                data-oid="yqephw8"
                                            >
                                                📍 Location:
                                            </span>
                                            <p
                                                className="text-blue-900 font-semibold"
                                                data-oid="3gs6sj:"
                                            >
                                                {medicine.selectedProduct.cityName}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {displayMedicine?.warnings && displayMedicine.warnings.length > 0 && (
                                <div
                                    className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                                    data-oid="t5d8o3f"
                                >
                                    <span
                                        className="text-yellow-700 font-medium flex items-center"
                                        data-oid="udp.qz-"
                                    >
                                        <span className="mr-2" data-oid="p4k36-0">
                                            ⚠️
                                        </span>
                                        Important Warnings:
                                    </span>
                                    <ul
                                        className="text-yellow-800 text-sm mt-2 list-disc list-inside space-y-1"
                                        data-oid="ygnh--m"
                                    >
                                        {displayMedicine.warnings
                                            .slice(0, 2)
                                            .map((warning, idx) => (
                                                <li key={idx} data-oid="xgd.k:5">
                                                    {warning}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Total for this medicine */}
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-xl p-4 text-white"
                        data-oid="zwob5bf"
                    >
                        <div className="flex items-center justify-between" data-oid="do.21p5">
                            <span className="font-medium flex items-center" data-oid="q2w4zuw">
                                <span className="text-xl mr-2" data-oid="uhu4f.m">
                                    💰
                                </span>
                                Total for this medicine:
                            </span>
                            <span className="font-bold text-2xl" data-oid="7t6x1dg">
                                EGP {(medicine.price * medicine.quantity).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medicine Search Modal */}
            {showSearchModal && (
                <MedicineSearchModal
                    onSelect={handleMedicineSelect}
                    onClose={() => setShowSearchModal(false)}
                    data-oid="6oqm4m6"
                />
            )}
        </>
    );
}
