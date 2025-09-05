'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    Clock,
    Phone,
    AlertTriangle,
    Navigation,
    Filter,
    Star,
    Truck,
    Shield,
} from 'lucide-react';
import {
    EmergencyMedicineService,
    EmergencyMedicine,
    EmergencySearchResult,
    EmergencySearchFilters,
} from '@/lib/services/emergencyMedicineService';

export function EmergencyMedicineLocator() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<EmergencyMedicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<EmergencyMedicine | null>(null);
    const [availabilityResult, setAvailabilityResult] = useState<EmergencySearchResult | null>(
        null,
    );
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [filters, setFilters] = useState<EmergencySearchFilters>({
        openNow: true,
        maxDistance: 10,
    });
    const [showFilters, setShowFilters] = useState(false);
    const [emergencyCategories, setEmergencyCategories] = useState<any[]>([]);
    const [emergencyContacts, setEmergencyContacts] = useState<any>(null);

    // Load emergency categories and contacts
    useEffect(() => {
        const loadData = async () => {
            try {
                const [categories, contacts] = await Promise.all([
                    EmergencyMedicineService.getEmergencyCategories(),
                    EmergencyMedicineService.getEmergencyContacts(),
                ]);
                setEmergencyCategories(categories);
                setEmergencyContacts(contacts);
            } catch (error) {
                console.error('Error loading emergency data:', error);
            }
        };
        loadData();
    }, []);

    // Search medicines
    useEffect(() => {
        const searchMedicines = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const results =
                    await EmergencyMedicineService.searchEmergencyMedicines(searchQuery);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching medicines:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchMedicines, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Get medicine availability
    const checkAvailability = async (medicine: EmergencyMedicine) => {
        setSelectedMedicine(medicine);
        setIsLoadingAvailability(true);

        try {
            const result = await EmergencyMedicineService.getEmergencyMedicineAvailability(
                medicine.id,
                undefined, // User location would be obtained from geolocation API
                filters,
            );
            setAvailabilityResult(result);
        } catch (error) {
            console.error('Error checking availability:', error);
        } finally {
            setIsLoadingAvailability(false);
        }
    };

    // Search by condition
    const searchByCondition = async (condition: string) => {
        setIsSearching(true);
        try {
            const results = await EmergencyMedicineService.findMedicinesByCondition(condition);
            setSearchResults(results);
            setSearchQuery(condition);
        } catch (error) {
            console.error('Error searching by condition:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Get urgency color
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'critical':
                return 'text-red-600 bg-red-100 border-red-200';
            case 'high':
                return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'moderate':
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    // Get stock level color
    const getStockColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'text-green-600 bg-green-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-orange-600 bg-orange-100';
            case 'critical':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-6" data-oid="xzz8bjc">
            {/* Emergency Alert Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-oid="k-3p8h9">
                <div className="flex items-start space-x-3" data-oid="3ta:ni4">
                    <AlertTriangle
                        className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                        data-oid="z.::4px"
                    />

                    <div data-oid="egeiej1">
                        <h3 className="font-semibold text-red-800" data-oid="v1av615">
                            Medical Emergency?
                        </h3>
                        <p className="text-red-700 text-sm mt-1" data-oid="k-y:967">
                            If this is a life-threatening emergency, call{' '}
                            <strong data-oid="ic-1r:z">123</strong> immediately. This tool helps
                            locate medicines but should not delay emergency medical care.
                        </p>
                        {emergencyContacts && (
                            <div className="mt-2 flex flex-wrap gap-4 text-sm" data-oid="q0k.5xe">
                                <span data-oid="vej73si">
                                    🚨 Emergency: {emergencyContacts.emergencyServices}
                                </span>
                                <span data-oid=":flmfyl">
                                    ☎️ Medical: {emergencyContacts.medicalEmergency}
                                </span>
                                <span data-oid="p00ugcl">
                                    💊 Pharmacy: {emergencyContacts.pharmacyHotline}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Emergency Categories */}
            <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                data-oid="k2n:p4j"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="tba.-u9">
                    Quick Emergency Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-oid="ntr3d0j">
                    {emergencyCategories.map((category) => (
                        <button
                            key={category.category}
                            onClick={() => searchByCondition(category.name)}
                            className={`p-3 rounded-lg border text-left hover:shadow-md transition-shadow ${getUrgencyColor(category.urgencyLevel)}`}
                            data-oid=":7g6ggr"
                        >
                            <div className="font-medium text-sm" data-oid="p-2tv88">
                                {category.name}
                            </div>
                            <div className="text-xs mt-1 opacity-75" data-oid="dw8g4::">
                                {category.medicineCount} medicines
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Section */}
            <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                data-oid="7vk9:vp"
            >
                <div className="flex items-center justify-between mb-4" data-oid=":9oti.m">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="rbqbv6-">
                        Search Emergency Medicines
                    </h3>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        data-oid="7hpjc-q"
                    >
                        <Filter className="w-4 h-4" data-oid="uw6szz4" />
                        <span data-oid="g2qfnqm">Filters</span>
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4" data-oid="48tj-sm">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                        data-oid="j:kfb40"
                    />

                    <input
                        type="text"
                        placeholder="Search by medicine name, condition, or symptoms (e.g., 'chest pain', 'asthma', 'aspirin')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                        data-oid="mvwtuk4"
                    />
                </div>

                {/* Filters */}
                {showFilters && (
                    <div
                        className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        data-oid="ctkufuu"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="fj5894i">
                            <div data-oid="1wr39kl">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="bweq79e"
                                >
                                    Maximum Distance (km)
                                </label>
                                <select
                                    value={filters.maxDistance || ''}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            maxDistance: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F]"
                                    data-oid="yg.nhn4"
                                >
                                    <option value="" data-oid="enkm43e">
                                        Any distance
                                    </option>
                                    <option value="5" data-oid="r7vriz1">
                                        Within 5 km
                                    </option>
                                    <option value="10" data-oid="rrtpdmc">
                                        Within 10 km
                                    </option>
                                    <option value="20" data-oid="ge4e7wo">
                                        Within 20 km
                                    </option>
                                    <option value="50" data-oid="z2np_pk">
                                        Within 50 km
                                    </option>
                                </select>
                            </div>
                            <div data-oid="61ou2af">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="a6-bclg"
                                >
                                    Availability
                                </label>
                                <div className="space-y-2" data-oid="trea0l_">
                                    <label className="flex items-center" data-oid="05vz0dz">
                                        <input
                                            type="checkbox"
                                            checked={filters.openNow || false}
                                            onChange={(e) =>
                                                setFilters({
                                                    ...filters,
                                                    openNow: e.target.checked,
                                                })
                                            }
                                            className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                            data-oid="rbc0.4:"
                                        />

                                        <span className="ml-2 text-sm" data-oid="fy1:un-">
                                            Open now
                                        </span>
                                    </label>
                                    <label className="flex items-center" data-oid="wzv8hdo">
                                        <input
                                            type="checkbox"
                                            checked={filters.hasDelivery || false}
                                            onChange={(e) =>
                                                setFilters({
                                                    ...filters,
                                                    hasDelivery: e.target.checked,
                                                })
                                            }
                                            className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                            data-oid="ez4rg3a"
                                        />

                                        <span className="ml-2 text-sm" data-oid="s9afgjg">
                                            Delivery available
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div data-oid="z5rv42:">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="bpqc3nv"
                                >
                                    Stock Level
                                </label>
                                <select
                                    value={filters.stockLevel || 'any'}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            stockLevel: e.target.value as any,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F]"
                                    data-oid="pvji4qw"
                                >
                                    <option value="any" data-oid="ql.h2h9">
                                        Any stock level
                                    </option>
                                    <option value="high" data-oid="gutaeqo">
                                        High stock only
                                    </option>
                                    <option value="medium" data-oid="vgt.7qw">
                                        Medium+ stock
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {searchQuery && (
                    <div data-oid="icksu7q">
                        {isSearching ? (
                            <div className="text-center py-8" data-oid="92zk-.t">
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F] mx-auto"
                                    data-oid="b.a6i-a"
                                ></div>
                                <p className="text-gray-500 mt-2" data-oid="-8yvkpz">
                                    Searching emergency medicines...
                                </p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-3" data-oid="h5wlm-7">
                                <h4 className="font-medium text-gray-900" data-oid="t5c403u">
                                    Found {searchResults.length} emergency medicine(s)
                                </h4>
                                {searchResults.map((medicine) => (
                                    <div
                                        key={medicine.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        data-oid=":h3rx60"
                                    >
                                        <div
                                            className="flex justify-between items-start mb-2"
                                            data-oid="p89bxm1"
                                        >
                                            <div data-oid="mjbnhc2">
                                                <h5
                                                    className="font-semibold text-gray-900"
                                                    data-oid="4tmfytm"
                                                >
                                                    {medicine.name}
                                                </h5>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="5dxds-6"
                                                >
                                                    {medicine.genericName} •{' '}
                                                    {medicine.activeIngredient}
                                                </p>
                                            </div>
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="ac3bgxd"
                                            >
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(medicine.urgencyLevel)}`}
                                                    data-oid=":cc_yoz"
                                                >
                                                    {medicine.urgencyLevel.toUpperCase()}
                                                </span>
                                                {medicine.controlledSubstance && (
                                                    <Shield
                                                        className="w-4 h-4 text-orange-600"
                                                        title="Controlled Substance"
                                                        data-oid="jnzohvh"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <p
                                            className="text-sm text-gray-700 mb-3"
                                            data-oid="x_6tb_a"
                                        >
                                            {medicine.description}
                                        </p>

                                        <div className="mb-3" data-oid="hu:8c55">
                                            <p
                                                className="text-sm font-medium text-gray-900 mb-1"
                                                data-oid="dtfxe5b"
                                            >
                                                Emergency Use:
                                            </p>
                                            <div
                                                className="flex flex-wrap gap-1"
                                                data-oid="lpoxyeq"
                                            >
                                                {medicine.emergencyUse.conditions
                                                    .slice(0, 3)
                                                    .map((condition, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                                            data-oid="ejmhdgw"
                                                        >
                                                            {condition}
                                                        </span>
                                                    ))}
                                                {medicine.emergencyUse.conditions.length > 3 && (
                                                    <span
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                        data-oid="_4dnm45"
                                                    >
                                                        +
                                                        {medicine.emergencyUse.conditions.length -
                                                            3}{' '}
                                                        more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="flex justify-between items-center"
                                            data-oid="bbjfgq."
                                        >
                                            <div
                                                className="text-sm text-gray-600"
                                                data-oid="4pw19wg"
                                            >
                                                {medicine.prescriptionRequired ? (
                                                    <span
                                                        className="text-orange-600"
                                                        data-oid="ksuak8."
                                                    >
                                                        📋 Prescription required
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="text-green-600"
                                                        data-oid=":hnimk7"
                                                    >
                                                        ✅ No prescription needed
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => checkAvailability(medicine)}
                                                className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] flex items-center space-x-2"
                                                data-oid="2i.bidf"
                                            >
                                                <MapPin className="w-4 h-4" data-oid="4asr0de" />
                                                <span data-oid="iiuur0-">Find Nearby</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : searchQuery.length >= 2 ? (
                            <div className="text-center py-8" data-oid="9e8ydb:">
                                <p className="text-gray-500" data-oid=":glmc_8">
                                    No emergency medicines found for {'"'}{searchQuery}{'"'}
                                </p>
                                <p className="text-sm text-gray-400 mt-1" data-oid="1--qizh">
                                    Try searching by condition or medicine name
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Availability Results */}
            {selectedMedicine && (
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    data-oid="duju0pc"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="r40-8g4">
                        Availability for {selectedMedicine.name}
                    </h3>

                    {isLoadingAvailability ? (
                        <div className="text-center py-8" data-oid="jk2h09p">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F] mx-auto"
                                data-oid="61ahn0k"
                            ></div>
                            <p className="text-gray-500 mt-2" data-oid="vw2__65">
                                Checking pharmacy availability...
                            </p>
                        </div>
                    ) : availabilityResult ? (
                        <div className="space-y-6" data-oid="wmvgwkf">
                            {/* Summary */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid="wa1jcmn"
                            >
                                <div
                                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                    data-oid="ttvrwf3"
                                >
                                    <div
                                        className="text-2xl font-bold text-blue-600"
                                        data-oid="33noc.2"
                                    >
                                        {availabilityResult.totalPharmaciesWithStock}
                                    </div>
                                    <div className="text-sm text-blue-700" data-oid="d-e7gwa">
                                        Pharmacies with stock
                                    </div>
                                </div>
                                <div
                                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                                    data-oid="hd30j8v"
                                >
                                    <div
                                        className="text-2xl font-bold text-green-600"
                                        data-oid=":5sl37r"
                                    >
                                        {availabilityResult.nearestPharmacy
                                            ? `${availabilityResult.nearestPharmacy.distance.toFixed(1)} km`
                                            : 'N/A'}
                                    </div>
                                    <div className="text-sm text-green-700" data-oid="a-tehqw">
                                        Nearest pharmacy
                                    </div>
                                </div>
                                <div
                                    className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                                    data-oid="ih5:d:c"
                                >
                                    <div
                                        className="text-2xl font-bold text-purple-600"
                                        data-oid="7:j2m52"
                                    >
                                        {availabilityResult.averageDistance.toFixed(1)} km
                                    </div>
                                    <div className="text-sm text-purple-700" data-oid="w4nw--d">
                                        Average distance
                                    </div>
                                </div>
                            </div>

                            {/* Urgency Recommendations */}
                            {availabilityResult.urgencyRecommendations.length > 0 && (
                                <div
                                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                                    data-oid="9qmizkb"
                                >
                                    <h4
                                        className="font-semibold text-yellow-800 mb-2"
                                        data-oid="l:h:ew3"
                                    >
                                        ⚠️ Important Recommendations
                                    </h4>
                                    <ul className="space-y-1" data-oid="676bu.e">
                                        {availabilityResult.urgencyRecommendations.map(
                                            (rec, index) => (
                                                <li
                                                    key={index}
                                                    className="text-yellow-700 text-sm"
                                                    data-oid="cnt2h.-"
                                                >
                                                    {rec}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Available Pharmacies */}
                            <div data-oid=".04:iku">
                                <h4 className="font-semibold text-gray-900 mb-3" data-oid="0avouts">
                                    Available Pharmacies
                                </h4>
                                {availabilityResult.availablePharmacies.length > 0 ? (
                                    <div className="space-y-3" data-oid="u3t2c4-">
                                        {availabilityResult.availablePharmacies.map((pharmacy) => (
                                            <div
                                                key={pharmacy.pharmacyId}
                                                className={`border rounded-lg p-4 ${pharmacy.hasStock ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                                                data-oid="_:n_gim"
                                            >
                                                <div
                                                    className="flex justify-between items-start mb-2"
                                                    data-oid="::t9-mh"
                                                >
                                                    <div data-oid="l:ailqn">
                                                        <h5
                                                            className="font-semibold text-gray-900"
                                                            data-oid="nkx1vbn"
                                                        >
                                                            {pharmacy.pharmacyName}
                                                        </h5>
                                                        <p
                                                            className="text-sm text-gray-600 flex items-center"
                                                            data-oid="2_cmx6t"
                                                        >
                                                            <MapPin
                                                                className="w-4 h-4 mr-1"
                                                                data-oid="np:ks3v"
                                                            />
                                                            {pharmacy.address} •{' '}
                                                            {pharmacy.distance.toFixed(1)} km away
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="0hh-hcn"
                                                    >
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStockColor(pharmacy.stockLevel)}`}
                                                            data-oid="a6e5ui."
                                                        >
                                                            {pharmacy.stockLevel} stock
                                                        </span>
                                                        {pharmacy.isOpen ? (
                                                            <span
                                                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                                data-oid="_hp:i9k"
                                                            >
                                                                Open
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                                                                data-oid="cjefxps"
                                                            >
                                                                Closed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div
                                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
                                                    data-oid="o82htp."
                                                >
                                                    <div data-oid="j9op9m4">
                                                        <span
                                                            className="font-medium"
                                                            data-oid="1vo:mh:"
                                                        >
                                                            Price:
                                                        </span>{' '}
                                                        {pharmacy.price} EGP
                                                    </div>
                                                    <div
                                                        className="flex items-center"
                                                        data-oid=".t5vnw0"
                                                    >
                                                        <Clock
                                                            className="w-4 h-4 mr-1"
                                                            data-oid="2-6n1wg"
                                                        />

                                                        <span data-oid="ff2scd-">
                                                            {pharmacy.estimatedDeliveryTime}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="kga02q_"
                                                    >
                                                        <Phone
                                                            className="w-4 h-4 mr-1"
                                                            data-oid="gjcr.7m"
                                                        />

                                                        <span data-oid=".332g56">
                                                            {pharmacy.phone}
                                                        </span>
                                                    </div>
                                                </div>

                                                {pharmacy.deliveryAvailable && (
                                                    <div
                                                        className="mt-2 flex items-center text-sm text-blue-600"
                                                        data-oid="ha053bb"
                                                    >
                                                        <Truck
                                                            className="w-4 h-4 mr-1"
                                                            data-oid="ibc:3mg"
                                                        />

                                                        <span data-oid="54:3gih">
                                                            Delivery available
                                                        </span>
                                                    </div>
                                                )}

                                                {pharmacy.specialInstructions && (
                                                    <div
                                                        className="mt-2 p-2 bg-yellow-100 border border-yellow-200 rounded text-sm text-yellow-800"
                                                        data-oid=":07r6yc"
                                                    >
                                                        {pharmacy.specialInstructions}
                                                    </div>
                                                )}

                                                <div
                                                    className="mt-3 flex space-x-2"
                                                    data-oid="-ymzpbp"
                                                >
                                                    <button
                                                        className="px-3 py-1 bg-[#1F1F6F] text-white rounded text-sm hover:bg-[#14274E]"
                                                        data-oid="1s_864z"
                                                    >
                                                        Call Pharmacy
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                                                        data-oid="1-juwv5"
                                                    >
                                                        Get Directions
                                                    </button>
                                                    {pharmacy.deliveryAvailable && (
                                                        <button
                                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                            data-oid="fqg4hnv"
                                                        >
                                                            Request Delivery
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        className="text-center py-8 text-gray-500"
                                        data-oid="cyy7tv."
                                    >
                                        <MapPin
                                            className="w-12 h-12 mx-auto mb-2 text-gray-300"
                                            data-oid="4-88e.6"
                                        />

                                        <p data-oid="sy6-hz6">
                                            No pharmacies found with this medicine in your area
                                        </p>
                                        <p className="text-sm mt-1" data-oid="wj1s:e7">
                                            Try expanding your search radius or contact emergency
                                            services
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Emergency Alternatives */}
                            {availabilityResult.emergencyAlternatives.length > 0 && (
                                <div data-oid="1gtv3:3">
                                    <h4
                                        className="font-semibold text-gray-900 mb-3"
                                        data-oid="p:hg4wf"
                                    >
                                        Emergency Alternatives
                                    </h4>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                        data-oid="jlswqkb"
                                    >
                                        {availabilityResult.emergencyAlternatives.map((alt) => (
                                            <div
                                                key={alt.id}
                                                className="border border-gray-200 rounded-lg p-3"
                                                data-oid="337t958"
                                            >
                                                <h5
                                                    className="font-medium text-gray-900"
                                                    data-oid="hqm10hl"
                                                >
                                                    {alt.name}
                                                </h5>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="bt57v3b"
                                                >
                                                    {alt.description}
                                                </p>
                                                <button
                                                    onClick={() => checkAvailability(alt)}
                                                    className="mt-2 text-sm text-[#1F1F6F] hover:underline"
                                                    data-oid="i2ovs6o"
                                                >
                                                    Check availability →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500" data-oid="3.801kw">
                            <p data-oid="-x8kk5c">Unable to load availability information</p>
                        </div>
                    )}
                </div>
            )}

            {/* Emergency Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6" data-oid="536r5l3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="znu0-k3">
                    Emergency Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid=".e5jd61">
                    <div data-oid="7q3gq0x">
                        <h4 className="font-medium text-gray-900 mb-2" data-oid="69:g:n-">
                            When to Use This Tool
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1" data-oid="g9gcddq">
                            <li data-oid="ia6sl:i">• Need to find emergency medicines quickly</li>
                            <li data-oid=":3qt7z4">• Looking for 24/7 pharmacy availability</li>
                            <li data-oid="e8l-.bx">• Checking stock levels before traveling</li>
                            <li data-oid="cob-kg7">
                                • Finding alternatives for unavailable medicines
                            </li>
                        </ul>
                    </div>
                    <div data-oid=".x.1oyt">
                        <h4 className="font-medium text-gray-900 mb-2" data-oid="45:pfjs">
                            Important Notes
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1" data-oid="n_e_shl">
                            <li data-oid="h96k0oa">
                                • Always call pharmacy to confirm availability
                            </li>
                            <li data-oid="ii2:09w">
                                • Bring valid prescription for controlled substances
                            </li>
                            <li data-oid="blzyvto">• Consider delivery options for urgent needs</li>
                            <li data-oid="yi.7vi7">
                                • Contact emergency services for life-threatening situations
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
