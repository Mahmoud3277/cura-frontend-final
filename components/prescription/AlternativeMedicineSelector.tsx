'use client';

import { ExtendedMedicine, MedicineAlternative } from '@/lib/data/medicineData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AlternativeMedicineSelectorProps {
    originalMedicine: ExtendedMedicine;
    selectedAlternative?: ExtendedMedicine;
    onSelectAlternative: (alternative: ExtendedMedicine | null) => void;
}

export function AlternativeMedicineSelector({
    originalMedicine,
    selectedAlternative,
    onSelectAlternative,
}: AlternativeMedicineSelectorProps) {
    const handleSelectAlternative = (alternative: MedicineAlternative) => {
        // Convert MedicineAlternative to ExtendedMedicine format
        const extendedAlternative: ExtendedMedicine = {
            ...originalMedicine,
            id: alternative.id,
            name: alternative.name,
            genericName: alternative.genericName,
            activeIngredient: alternative.activeIngredient,
            strength: alternative.strength,
            form: alternative.form,
            manufacturer: alternative.manufacturer,
            description: alternative.description,
            image: alternative.image,
            pharmacyMapping: {
                ...originalMedicine.pharmacyMapping,
                averagePrice: alternative.averagePrice,
                lowestPrice: alternative.priceRange.min,
                highestPrice: alternative.priceRange.max,
                availabilityPercentage: (alternative.pharmacyCount / 10) * 100, // Assuming 10 total pharmacies
            },
        };

        onSelectAlternative(extendedAlternative);
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'in-stock':
                return 'bg-green-100 text-green-800';
            case 'low-stock':
                return 'bg-yellow-100 text-yellow-800';
            case 'out-of-stock':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-3" data-oid="onae076">
            {/* Original Medicine Option */}
            <Card
                className={`cursor-pointer transition-all duration-200 ${
                    !selectedAlternative
                        ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                        : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSelectAlternative(null)}
                data-oid="i0dzlwc"
            >
                <CardContent className="p-4" data-oid="cw_6j56">
                    <div className="flex items-center justify-between" data-oid="nrb6vtz">
                        <div className="flex-1" data-oid="dcdiymc">
                            <div className="flex items-center gap-2 mb-2" data-oid=".pt9-ez">
                                <h4 className="font-semibold text-gray-900" data-oid="1nrxdzq">
                                    {originalMedicine.name}
                                </h4>
                                <Badge
                                    variant="outline"
                                    className="text-blue-600 border-blue-600"
                                    data-oid="r9k0wdi"
                                >
                                    Original
                                </Badge>
                                {!selectedAlternative && (
                                    <Badge className="bg-[#1F1F6F] text-white" data-oid="2d.tc-i">
                                        Selected
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2" data-oid="hh5_tdk">
                                {originalMedicine.strength} • {originalMedicine.form} •{' '}
                                {originalMedicine.manufacturer}
                            </p>
                            <div className="flex items-center gap-4 text-sm" data-oid="buhsd5e">
                                <span className="text-gray-600" data-oid="p12yh6h">
                                    Price:{' '}
                                    <span className="font-semibold" data-oid="g0k.c-4">
                                        EGP{' '}
                                        {originalMedicine.pharmacyMapping.averagePrice.toFixed(2)}
                                    </span>
                                </span>
                                <span className="text-gray-600" data-oid="a2bk.z2">
                                    Available:{' '}
                                    <span className="font-semibold" data-oid="mmbm2.w">
                                        {originalMedicine.pharmacyMapping.availabilityPercentage}%
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alternative Medicines */}
            {originalMedicine.alternatives.map((alternative) => (
                <Card
                    key={alternative.id}
                    className={`cursor-pointer transition-all duration-200 ${
                        selectedAlternative?.id === alternative.id
                            ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectAlternative(alternative)}
                    data-oid="vtkox-."
                >
                    <CardContent className="p-4" data-oid="-tpajo2">
                        <div className="flex items-center justify-between" data-oid="dpgjis7">
                            <div className="flex-1" data-oid="pucgnfv">
                                <div className="flex items-center gap-2 mb-2" data-oid="0hacot3">
                                    <h4 className="font-semibold text-gray-900" data-oid="osav6dv">
                                        {alternative.name}
                                    </h4>
                                    <Badge
                                        className={getAvailabilityColor(alternative.availability)}
                                        variant="outline"
                                        data-oid="sp4lbtp"
                                    >
                                        {alternative.availability.replace('-', ' ')}
                                    </Badge>
                                    {selectedAlternative?.id === alternative.id && (
                                        <Badge
                                            className="bg-[#1F1F6F] text-white"
                                            data-oid="in9wxdn"
                                        >
                                            Selected
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2" data-oid="fni1ze1">
                                    {alternative.strength} • {alternative.form} •{' '}
                                    {alternative.manufacturer}
                                </p>

                                {alternative.description && (
                                    <p className="text-sm text-gray-700 mb-2" data-oid="kck39.a">
                                        {alternative.description}
                                    </p>
                                )}

                                <div
                                    className="flex items-center gap-4 text-sm mb-2"
                                    data-oid="hcs8e3p"
                                >
                                    <span className="text-gray-600" data-oid="5nc5exu">
                                        Price:{' '}
                                        <span className="font-semibold" data-oid="4fgu912">
                                            EGP {alternative.averagePrice.toFixed(2)}
                                        </span>
                                    </span>
                                    <span className="text-gray-600" data-oid="26ekt.8">
                                        Range:{' '}
                                        <span className="font-semibold" data-oid="uwffwk1">
                                            EGP {alternative.priceRange.min} -{' '}
                                            {alternative.priceRange.max}
                                        </span>
                                    </span>
                                    <span className="text-gray-600" data-oid="rv98oik">
                                        Pharmacies:{' '}
                                        <span className="font-semibold" data-oid="wi9.tgw">
                                            {alternative.pharmacyCount}
                                        </span>
                                    </span>
                                </div>

                                {/* Advantages */}
                                {alternative.advantages && alternative.advantages.length > 0 && (
                                    <div className="mb-2" data-oid="hel2rpr">
                                        <span
                                            className="text-xs font-medium text-green-700"
                                            data-oid="lw.c_d_"
                                        >
                                            Advantages:
                                        </span>
                                        <ul
                                            className="text-xs text-green-600 mt-1"
                                            data-oid="28gwwb6"
                                        >
                                            {alternative.advantages
                                                .slice(0, 2)
                                                .map((advantage, idx) => (
                                                    <li key={idx} data-oid="ule6007">
                                                        • {advantage}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Considerations */}
                                {alternative.considerations &&
                                    alternative.considerations.length > 0 && (
                                        <div data-oid="67hjyx7">
                                            <span
                                                className="text-xs font-medium text-orange-700"
                                                data-oid="wt71scf"
                                            >
                                                Considerations:
                                            </span>
                                            <ul
                                                className="text-xs text-orange-600 mt-1"
                                                data-oid="g3k8bpc"
                                            >
                                                {alternative.considerations
                                                    .slice(0, 2)
                                                    .map((consideration, idx) => (
                                                        <li key={idx} data-oid="60v935-">
                                                            • {consideration}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
