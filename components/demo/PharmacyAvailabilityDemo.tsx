'use client';

// Demo component for Pharmacy Availability System
// Task 3.2: Create Pharmacy Availability System - Demo

import React, { useState, useEffect } from 'react';
import {
    pharmacyAvailabilityService,
    PharmacyAvailabilityInfo,
    MedicineAvailabilityReport,
} from '../../lib/services/pharmacyAvailabilityService';
import { extendedMedicineData } from '../../lib/data/medicineData';
import {
    getStockLevelInfo,
    getAvailabilityStatus,
    formatStockQuantity,
    formatRestockTime,
    isPharmacyOpen,
    formatWorkingHours,
} from '../../lib/utils/pharmacyAvailabilityUtils';

export default function PharmacyAvailabilityDemo() {
    const [selectedMedicine, setSelectedMedicine] = useState<string>(
        extendedMedicineData[0]?.id || '',
    );
    const [selectedCity, setSelectedCity] = useState<string>('ismailia-city');
    const [availabilityReport, setAvailabilityReport] = useState<MedicineAvailabilityReport | null>(
        null,
    );
    const [stockAlerts, setStockAlerts] = useState<any[]>([]);
    const [restockSimulations, setRestockSimulations] = useState<any[]>([]);

    useEffect(() => {
        if (selectedMedicine) {
            const report = pharmacyAvailabilityService.getMedicineAvailabilityReport(
                selectedMedicine,
                selectedCity,
            );
            setAvailabilityReport(report);
        }
    }, [selectedMedicine, selectedCity]);

    useEffect(() => {
        const alerts = pharmacyAvailabilityService.getStockAlerts(selectedCity);
        setStockAlerts(alerts);

        const simulations = pharmacyAvailabilityService.getPendingRestockSimulations();
        setRestockSimulations(simulations);
    }, [selectedCity]);

    const handleSimulateRestock = (medicineId: string, pharmacyId: string) => {
        try {
            const simulation = pharmacyAvailabilityService.simulateRestock(medicineId, pharmacyId);
            alert(
                `Restock simulation created! Expected delivery: ${formatRestockTime(simulation.restockDate)}`,
            );

            // Refresh data
            const report = pharmacyAvailabilityService.getMedicineAvailabilityReport(
                selectedMedicine,
                selectedCity,
            );
            setAvailabilityReport(report);

            const simulations = pharmacyAvailabilityService.getPendingRestockSimulations();
            setRestockSimulations(simulations);
        } catch (error) {
            alert('Error creating restock simulation');
        }
    };

    const handleExecuteRestock = (medicineId: string, pharmacyId: string) => {
        const success = pharmacyAvailabilityService.executeRestockSimulation(
            medicineId,
            pharmacyId,
        );
        if (success) {
            alert('Restock executed successfully!');

            // Refresh data
            const report = pharmacyAvailabilityService.getMedicineAvailabilityReport(
                selectedMedicine,
                selectedCity,
            );
            setAvailabilityReport(report);

            const alerts = pharmacyAvailabilityService.getStockAlerts(selectedCity);
            setStockAlerts(alerts);

            const simulations = pharmacyAvailabilityService.getPendingRestockSimulations();
            setRestockSimulations(simulations);
        } else {
            alert('Error executing restock');
        }
    };

    const handleAutoExecuteRestocks = () => {
        const executed = pharmacyAvailabilityService.autoExecuteRestockSimulations();
        alert(`Auto-executed ${executed.length} restock simulations`);

        // Refresh all data
        const report = pharmacyAvailabilityService.getMedicineAvailabilityReport(
            selectedMedicine,
            selectedCity,
        );
        setAvailabilityReport(report);

        const alerts = pharmacyAvailabilityService.getStockAlerts(selectedCity);
        setStockAlerts(alerts);

        const simulations = pharmacyAvailabilityService.getPendingRestockSimulations();
        setRestockSimulations(simulations);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8" data-oid="bpxbmer">
            <div className="bg-white rounded-lg shadow-lg p-6" data-oid="z6qid7n">
                <h1 className="text-3xl font-bold text-gray-900 mb-6" data-oid="ut7e2cm">
                    Pharmacy Availability System Demo
                </h1>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" data-oid="agroldc">
                    <div data-oid="t0eblb2">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="mb3phvh"
                        >
                            Select Medicine
                        </label>
                        <select
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-oid="t9i_4be"
                        >
                            {extendedMedicineData.map((medicine) => (
                                <option key={medicine.id} value={medicine.id} data-oid="mm.zxwr">
                                    {medicine.name} - {medicine.strength}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div data-oid="i5nxyq0">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="x9hf2jm"
                        >
                            Select City
                        </label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-oid="ujk0103"
                        >
                            <option value="ismailia-city" data-oid="fkoqevq">
                                Ismailia City
                            </option>
                            <option value="cairo-city" data-oid="5mjsap-">
                                Cairo City
                            </option>
                            <option value="alexandria-city" data-oid="p-fy.:.">
                                Alexandria City
                            </option>
                            <option value="giza-city" data-oid="l87j.ey">
                                Giza City
                            </option>
                        </select>
                    </div>

                    <div className="flex items-end" data-oid="85o6mvw">
                        <button
                            onClick={handleAutoExecuteRestocks}
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            data-oid="::g-vv5"
                        >
                            Auto Execute Due Restocks
                        </button>
                    </div>
                </div>
            </div>

            {/* Availability Report */}
            {availabilityReport && (
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="q:hubl4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="k2mo-_d">
                        Availability Report: {availabilityReport.medicineName}
                    </h2>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-oid="rav2uh0">
                        <div className="bg-blue-50 p-4 rounded-lg" data-oid="qvvo2qh">
                            <div className="text-2xl font-bold text-blue-600" data-oid="a9x_iac">
                                {availabilityReport.availablePharmacies}
                            </div>
                            <div className="text-sm text-blue-800" data-oid="b_7dqo0">
                                Available Pharmacies
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg" data-oid="yt.6nae">
                            <div className="text-2xl font-bold text-green-600" data-oid="qnu2yun">
                                {availabilityReport.availabilityPercentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-green-800" data-oid="qd38_wq">
                                Availability Rate
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg" data-oid="u35ai34">
                            <div className="text-2xl font-bold text-purple-600" data-oid="k86nwnp">
                                {availabilityReport.lowestPrice} EGP
                            </div>
                            <div className="text-sm text-purple-800" data-oid="3okdb7k">
                                Lowest Price
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg" data-oid="ahha6z4">
                            <div className="text-2xl font-bold text-orange-600" data-oid="om..xbw">
                                {availabilityReport.averagePrice.toFixed(2)} EGP
                            </div>
                            <div className="text-sm text-orange-800" data-oid="qartegd">
                                Average Price
                            </div>
                        </div>
                    </div>

                    {/* Available Pharmacies */}
                    <div className="mb-8" data-oid="_1b4h:o">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4" data-oid="igsubzn">
                            Available Pharmacies ({availabilityReport.recommendedPharmacies.length})
                        </h3>
                        <div className="grid gap-4" data-oid="g3_duc3">
                            {availabilityReport.recommendedPharmacies.map((pharmacy) => (
                                <PharmacyAvailabilityCard
                                    key={pharmacy.pharmacyId}
                                    pharmacy={pharmacy}
                                    onSimulateRestock={() =>
                                        handleSimulateRestock(
                                            availabilityReport.medicineId,
                                            pharmacy.pharmacyId,
                                        )
                                    }
                                    data-oid="is7ack6"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Out of Stock Pharmacies */}
                    {availabilityReport.outOfStockPharmacies.length > 0 && (
                        <div data-oid="-1_moj3">
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-4"
                                data-oid="tkxxlmx"
                            >
                                Out of Stock Pharmacies (
                                {availabilityReport.outOfStockPharmacies.length})
                            </h3>
                            <div className="grid gap-4" data-oid="3nu1qxe">
                                {availabilityReport.outOfStockPharmacies.map((pharmacy) => (
                                    <PharmacyAvailabilityCard
                                        key={pharmacy.pharmacyId}
                                        pharmacy={pharmacy}
                                        onSimulateRestock={() =>
                                            handleSimulateRestock(
                                                availabilityReport.medicineId,
                                                pharmacy.pharmacyId,
                                            )
                                        }
                                        data-oid="fhqj8z8"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Stock Alerts */}
            {stockAlerts.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="l8f_vaq">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="n4ucmtb">
                        Stock Alerts ({stockAlerts.length})
                    </h2>
                    <div className="space-y-4" data-oid="c:kfu:n">
                        {stockAlerts.slice(0, 10).map((alert, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-l-4 ${
                                    alert.alertLevel === 'critical'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-yellow-500 bg-yellow-50'
                                }`}
                                data-oid="_bfpzx:"
                            >
                                <div
                                    className="flex justify-between items-start"
                                    data-oid=":pgcn5a"
                                >
                                    <div data-oid="01zxkk9">
                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="fsopww2"
                                        >
                                            {alert.medicine.name} at {alert.pharmacy.name}
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="tm_-o2f">
                                            {formatStockQuantity(alert.stock)} -{' '}
                                            {getStockLevelInfo(alert.stock.stockLevel).label}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleSimulateRestock(
                                                alert.medicine.id,
                                                alert.pharmacy.id,
                                            )
                                        }
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        data-oid="o-6za41"
                                    >
                                        Simulate Restock
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Restock Simulations */}
            {restockSimulations.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6" data-oid="ho-qab6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="4mpis__">
                        Pending Restock Simulations ({restockSimulations.length})
                    </h2>
                    <div className="space-y-4" data-oid="vn6kofp">
                        {restockSimulations.slice(0, 10).map((simulation, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg"
                                data-oid="rvwr5.u"
                            >
                                <div
                                    className="flex justify-between items-start"
                                    data-oid="d.t4rc4"
                                >
                                    <div data-oid="gpvsld.">
                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="ulthezi"
                                        >
                                            Medicine ID: {simulation.medicineId}
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="thsspcl">
                                            Pharmacy: {simulation.pharmacyId}
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="u7rykvd">
                                            Current: {simulation.currentStock} → New:{' '}
                                            {simulation.newStock}
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="_0iakcq">
                                            Expected: {formatRestockTime(simulation.restockDate)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleExecuteRestock(
                                                simulation.medicineId,
                                                simulation.pharmacyId,
                                            )
                                        }
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                        data-oid="fwbyh0v"
                                    >
                                        Execute Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Pharmacy Availability Card Component
function PharmacyAvailabilityCard({
    pharmacy,
    onSimulateRestock,
}: {
    pharmacy: PharmacyAvailabilityInfo;
    onSimulateRestock: () => void;
}) {
    const stockInfo = getStockLevelInfo(pharmacy.stockInfo.stockLevel);
    const availabilityStatus = getAvailabilityStatus(pharmacy.stockInfo);
    const isOpen = isPharmacyOpen(pharmacy.pharmacy);

    return (
        <div
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            data-oid="wf1jese"
        >
            <div className="flex justify-between items-start mb-3" data-oid="uaimz5w">
                <div data-oid="6xa96_x">
                    <h4 className="font-semibold text-gray-900" data-oid="zjsbarr">
                        {pharmacy.pharmacyName}
                    </h4>
                    <p className="text-sm text-gray-600" data-oid="z2st11w">
                        {pharmacy.pharmacy.address}
                    </p>
                </div>
                <div className="text-right" data-oid="7-.6v-o">
                    <div className="text-lg font-bold text-gray-900" data-oid="j8d36p2">
                        {pharmacy.stockInfo.price} EGP
                    </div>
                    <div
                        className={`text-xs px-2 py-1 rounded ${availabilityStatus.bgColor} ${availabilityStatus.textColor}`}
                        data-oid="erpm78x"
                    >
                        {availabilityStatus.icon} {availabilityStatus.label}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3" data-oid="rx3zurw">
                <div data-oid="6-xfvlc">
                    <div className="text-xs text-gray-500" data-oid="_ndzxt.">
                        Stock Level
                    </div>
                    <div className={`text-sm font-medium ${stockInfo.color}`} data-oid="3msk3lw">
                        {stockInfo.icon} {stockInfo.label}
                    </div>
                </div>
                <div data-oid="wzx5bl8">
                    <div className="text-xs text-gray-500" data-oid=".:et4my">
                        Quantity
                    </div>
                    <div className="text-sm font-medium" data-oid="kgk4j7:">
                        {formatStockQuantity(pharmacy.stockInfo)}
                    </div>
                </div>
                <div data-oid="uwjjp2-">
                    <div className="text-xs text-gray-500" data-oid="j:bowsa">
                        Delivery
                    </div>
                    <div className="text-sm font-medium" data-oid="q8vkne-">
                        {pharmacy.deliveryInfo.deliveryTime}
                    </div>
                </div>
                <div data-oid="tpjays1">
                    <div className="text-xs text-gray-500" data-oid="i:a:ip6">
                        Status
                    </div>
                    <div
                        className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}
                        data-oid="3vru6b0"
                    >
                        {isOpen ? '🟢 Open' : '🔴 Closed'}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center" data-oid="8x_l3m9">
                <div className="text-xs text-gray-500" data-oid="aao5_xp">
                    Working Hours: {formatWorkingHours(pharmacy.pharmacy)}
                </div>
                {!pharmacy.isAvailable && (
                    <button
                        onClick={onSimulateRestock}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        data-oid="wqd9_ds"
                    >
                        Simulate Restock
                    </button>
                )}
            </div>

            {pharmacy.estimatedRestockDate && (
                <div className="mt-2 text-xs text-blue-600" data-oid="jkp:eex">
                    📅 Estimated restock: {formatRestockTime(pharmacy.estimatedRestockDate)}
                </div>
            )}
        </div>
    );
}
