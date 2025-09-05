'use client';

// Medicine Card Interface Test Page
// Task 4.1: Build Medicine Card Interface - Demo

import React, { useState } from 'react';
import MedicineSelectionCard from '../../../components/prescription/MedicineSelectionCard';
import QuantitySelector, {
    QuantityPresets,
} from '../../../components/prescription/QuantitySelector';
import MedicineInstructions, {
    QuickInstructions,
} from '../../../components/prescription/MedicineInstructions';
import AlternativeMedicinesList, {
    CompactAlternativeSelector,
} from '../../../components/prescription/AlternativeMedicinesList';
import {
    extendedMedicineData,
    ExtendedMedicine,
    ProcessedMedicine,
} from '../../../lib/data/medicineData';
import {
    pharmacyAvailabilityService,
    PharmacyAvailabilityInfo,
} from '../../../lib/services/pharmacyAvailabilityService';

export default function MedicineCardTestPage() {
    const [selectedMedicine, setSelectedMedicine] = useState(extendedMedicineData[0]);
    const [selectedQuantity, setSelectedQuantity] = useState(20);
    const [selectedAlternative, setSelectedAlternative] = useState<ExtendedMedicine | null>(null);
    const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyAvailabilityInfo | null>(null);
    const [expandedCard, setExpandedCard] = useState(false);
    const [cityId] = useState('ismailia-city');

    // Get available pharmacies for the current medicine
    const availablePharmacies = pharmacyAvailabilityService.getAvailablePharmacies(
        selectedAlternative?.id || selectedMedicine.id,
        cityId,
    );

    // Mock prescription medicine data
    const prescriptionMedicine: ProcessedMedicine = {
        id: 'pm-001',
        productId: selectedMedicine.id,
        productName: selectedMedicine.name,
        quantity: 20,
        dosage: selectedMedicine.dosage,
        instructions:
            'Take 1 tablet every 6 hours as needed for pain or fever. Do not exceed 4 tablets in 24 hours.',
        price: selectedPharmacy?.stockInfo.price || selectedMedicine.pharmacyMapping.averagePrice,
        pharmacyId: selectedPharmacy?.pharmacyId || 'pharmacy-1',
        isAvailable: true,
    };

    // Set initial pharmacy if not selected
    React.useEffect(() => {
        if (availablePharmacies.length > 0 && !selectedPharmacy) {
            setSelectedPharmacy(availablePharmacies[0]);
        }
    }, [availablePharmacies, selectedPharmacy]);

    return (
        <div className="min-h-screen bg-gray-50 py-8" data-oid="3roxz2f">
            <div className="max-w-6xl mx-auto px-4 space-y-8" data-oid="fgc2m9e">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="t3-2m4:">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4" data-oid="8fx.:gh">
                        Medicine Card Interface Demo
                    </h1>
                    <p className="text-gray-600" data-oid="lepv72k">
                        Testing the medicine selection card components for Task 4.1
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid=".8rsz54">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="gzmm-cs">
                        Test Controls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="9t29o5x">
                        <div data-oid=".zmtr6:">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="tn3fl_g"
                            >
                                Select Medicine
                            </label>
                            <select
                                value={selectedMedicine.id}
                                onChange={(e) => {
                                    const medicine = extendedMedicineData.find(
                                        (m) => m.id === e.target.value,
                                    );
                                    if (medicine) {
                                        setSelectedMedicine(medicine);
                                        setSelectedAlternative(null);
                                        setSelectedPharmacy(null);
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                data-oid="gqfnnba"
                            >
                                {extendedMedicineData.map((medicine) => (
                                    <option
                                        key={medicine.id}
                                        value={medicine.id}
                                        data-oid="dqsf03i"
                                    >
                                        {medicine.name} - {medicine.strength}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div data-oid="ytep_1_">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="x29z0_v"
                            >
                                Selected Pharmacy
                            </label>
                            <select
                                value={selectedPharmacy?.pharmacyId || ''}
                                onChange={(e) => {
                                    const pharmacy = availablePharmacies.find(
                                        (p) => p.pharmacyId === e.target.value,
                                    );
                                    setSelectedPharmacy(pharmacy || null);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                data-oid=":lp:w6y"
                            >
                                <option value="" data-oid=".yv9v9:">
                                    Select Pharmacy
                                </option>
                                {availablePharmacies.map((pharmacy) => (
                                    <option
                                        key={pharmacy.pharmacyId}
                                        value={pharmacy.pharmacyId}
                                        data-oid="a10ggpa"
                                    >
                                        {pharmacy.pharmacyName} -{' '}
                                        {pharmacy.stockInfo.price.toFixed(2)} EGP
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Medicine Selection Card */}
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="l8sq_6m">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="9mlr_e2">
                        Medicine Selection Card (Full)
                    </h2>
                    <MedicineSelectionCard
                        medicine={selectedMedicine}
                        prescriptionMedicine={prescriptionMedicine}
                        prescribedQuantity={20}
                        selectedQuantity={selectedQuantity}
                        onQuantityChange={setSelectedQuantity}
                        selectedPharmacy={selectedPharmacy || undefined}
                        onPharmacyChange={setSelectedPharmacy}
                        availablePharmacies={availablePharmacies}
                        selectedAlternative={selectedAlternative}
                        onAlternativeChange={setSelectedAlternative}
                        cityId={cityId}
                        isExpanded={expandedCard}
                        onToggleExpand={() => setExpandedCard(!expandedCard)}
                        data-oid="24ciat2"
                    />
                </div>

                {/* Individual Components Testing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="ryfnvk3">
                    {/* Quantity Selector */}
                    <div className="bg-white rounded-lg shadow-lg p-6" data-oid=".6mab47">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="-o3idlk">
                            Quantity Selector Component
                        </h3>
                        <div className="space-y-6" data-oid="vxp_yi2">
                            <QuantitySelector
                                value={selectedQuantity}
                                min={1}
                                max={selectedPharmacy?.stockInfo.stockQuantity || 100}
                                unit={selectedMedicine.unit}
                                prescribedQuantity={20}
                                onChange={setSelectedQuantity}
                                size="md"
                                showPrescribedIndicator={true}
                                showMaxIndicator={true}
                                data-oid="d_s5.4n"
                            />

                            <QuantityPresets
                                currentValue={selectedQuantity}
                                prescribedQuantity={20}
                                maxQuantity={selectedPharmacy?.stockInfo.stockQuantity || 100}
                                unit={selectedMedicine.unit}
                                onChange={setSelectedQuantity}
                                data-oid="w.rv.v3"
                            />

                            {/* Different Sizes */}
                            <div className="space-y-3" data-oid="xgk8zbg">
                                <h4
                                    className="text-sm font-medium text-gray-700"
                                    data-oid="1b_::0:"
                                >
                                    Different Sizes:
                                </h4>

                                <div data-oid="t-3m0.y">
                                    <label className="text-xs text-gray-600" data-oid="q-sspoq">
                                        Small:
                                    </label>
                                    <QuantitySelector
                                        value={selectedQuantity}
                                        onChange={setSelectedQuantity}
                                        size="sm"
                                        unit={selectedMedicine.unit}
                                        showPrescribedIndicator={false}
                                        showMaxIndicator={false}
                                        data-oid="q48qpk5"
                                    />
                                </div>

                                <div data-oid="ty:u6h_">
                                    <label className="text-xs text-gray-600" data-oid="s_shpk1">
                                        Large:
                                    </label>
                                    <QuantitySelector
                                        value={selectedQuantity}
                                        onChange={setSelectedQuantity}
                                        size="lg"
                                        unit={selectedMedicine.unit}
                                        prescribedQuantity={20}
                                        data-oid="dh7:ts:"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medicine Instructions */}
                    <div className="bg-white rounded-lg shadow-lg p-6" data-oid=".yl.xke">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="v3r.o3_">
                            Medicine Instructions Component
                        </h3>
                        <div className="space-y-6" data-oid="jas20..">
                            {/* Quick Instructions */}
                            <div data-oid="sp8-1xj">
                                <h4
                                    className="text-sm font-medium text-gray-700 mb-2"
                                    data-oid="-4mxi1s"
                                >
                                    Quick Instructions:
                                </h4>
                                <QuickInstructions
                                    medicine={selectedMedicine}
                                    prescriptionMedicine={prescriptionMedicine}
                                    data-oid="3kxqat6"
                                />
                            </div>

                            {/* Compact Instructions */}
                            <div data-oid="skiukkj">
                                <h4
                                    className="text-sm font-medium text-gray-700 mb-2"
                                    data-oid="t1dknh-"
                                >
                                    Compact Instructions:
                                </h4>
                                <MedicineInstructions
                                    medicine={selectedMedicine}
                                    prescriptionMedicine={prescriptionMedicine}
                                    compact={true}
                                    data-oid="v28wmb8"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Instructions */}
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="251atp3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="vtgcpdx">
                        Full Medicine Instructions
                    </h3>
                    <MedicineInstructions
                        medicine={selectedMedicine}
                        prescriptionMedicine={prescriptionMedicine}
                        showFullDetails={true}
                        data-oid="cvu.hi2"
                    />
                </div>

                {/* Alternatives List */}
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="y6tt8vz">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="8xoct61">
                        Alternative Medicines List
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="2f5epke">
                        <div data-oid="yj5ka:g">
                            <h4
                                className="text-sm font-medium text-gray-700 mb-3"
                                data-oid="xx-q8f7"
                            >
                                Full Alternatives List:
                            </h4>
                            <AlternativeMedicinesList
                                originalMedicine={selectedMedicine}
                                alternatives={selectedMedicine.alternatives}
                                selectedAlternative={selectedAlternative}
                                onAlternativeSelect={setSelectedAlternative}
                                cityId={cityId}
                                showPricing={true}
                                showAvailability={true}
                                data-oid="0tzf06b"
                            />
                        </div>

                        <div data-oid="1k30dha">
                            <h4
                                className="text-sm font-medium text-gray-700 mb-3"
                                data-oid="z97dgek"
                            >
                                Compact Selector:
                            </h4>
                            <CompactAlternativeSelector
                                originalMedicine={selectedMedicine}
                                alternatives={selectedMedicine.alternatives}
                                selectedAlternative={selectedAlternative}
                                onAlternativeSelect={setSelectedAlternative}
                                data-oid="z:hl_45"
                            />

                            {/* Compact Alternatives List */}
                            <div className="mt-6" data-oid="exeou.v">
                                <h4
                                    className="text-sm font-medium text-gray-700 mb-3"
                                    data-oid="ona:zhz"
                                >
                                    Compact List:
                                </h4>
                                <AlternativeMedicinesList
                                    originalMedicine={selectedMedicine}
                                    alternatives={selectedMedicine.alternatives}
                                    selectedAlternative={selectedAlternative}
                                    onAlternativeSelect={setSelectedAlternative}
                                    cityId={cityId}
                                    compact={true}
                                    showPricing={false}
                                    showAvailability={false}
                                    data-oid="lb21ct5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Selection Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="s7xw47s">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="aj_3.me">
                        Current Selection Summary
                    </h3>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        data-oid="m81xy_k"
                    >
                        <div className="p-4 bg-blue-50 rounded-lg" data-oid="r54-cw0">
                            <h4 className="text-sm font-medium text-blue-900" data-oid="n.8ooyg">
                                Medicine
                            </h4>
                            <p className="text-lg font-bold text-blue-700" data-oid=".9.dgbv">
                                {selectedAlternative?.name || selectedMedicine.name}
                            </p>
                            <p className="text-sm text-blue-600" data-oid=".tecfjm">
                                {selectedAlternative ? 'Alternative' : 'Original'}
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg" data-oid="_q8579p">
                            <h4 className="text-sm font-medium text-green-900" data-oid="p7x:7qt">
                                Quantity
                            </h4>
                            <p className="text-lg font-bold text-green-700" data-oid="r8iu_z6">
                                {selectedQuantity} {selectedMedicine.unit}
                            </p>
                            <p className="text-sm text-green-600" data-oid="8-w6.js">
                                Prescribed: {prescriptionMedicine.quantity}
                            </p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg" data-oid="safe3qp">
                            <h4 className="text-sm font-medium text-purple-900" data-oid="3jeuz08">
                                Pharmacy
                            </h4>
                            <p className="text-lg font-bold text-purple-700" data-oid="._sx_8p">
                                {selectedPharmacy?.pharmacyName || 'Not selected'}
                            </p>
                            <p className="text-sm text-purple-600" data-oid="blf93d:">
                                {selectedPharmacy
                                    ? `${selectedPharmacy.stockInfo.price.toFixed(2)} EGP`
                                    : 'No price'}
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg" data-oid="md40m-5">
                            <h4 className="text-sm font-medium text-orange-900" data-oid="gwdrai8">
                                Total
                            </h4>
                            <p className="text-lg font-bold text-orange-700" data-oid=".930.lp">
                                {selectedPharmacy
                                    ? (selectedPharmacy.stockInfo.price * selectedQuantity).toFixed(
                                          2,
                                      )
                                    : '0.00'}{' '}
                                EGP
                            </p>
                            <p className="text-sm text-orange-600" data-oid="2kryrj5">
                                Including {selectedQuantity} units
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
