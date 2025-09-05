'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    MedicineDatabaseService,
    Medicine,
    MedicineSearchFilters,
    MedicineSearchResult,
} from '@/lib/services/medicineDatabaseService';

export default function MedicineDatabasePage() {
    const [searchResult, setSearchResult] = useState<MedicineSearchResult>({
        medicines: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<MedicineSearchFilters>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [manufacturers, setManufacturers] = useState<string[]>([]);
    const [forms, setForms] = useState<string[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        byCategory: {} as Record<string, number>,
        byAvailability: {} as Record<string, number>,
        prescriptionRequired: 0,
        overTheCounter: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        loadInitialData();
    }, []);

    useEffect(() => {
        searchMedicines();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, currentPage]);

    useEffect(() => {
        if (filters.category) {
            loadSubCategories(filters.category);
        } else {
            setSubCategories([]);
        }
    }, [filters.category]);

    const loadInitialData = async () => {
        try {
            const [categoriesData, manufacturersData, formsData, statsData] = await Promise.all([
                MedicineDatabaseService.getCategories(),
                MedicineDatabaseService.getManufacturers(),
                MedicineDatabaseService.getForms(),
                MedicineDatabaseService.getMedicineStats(),
            ]);

            setCategories(categoriesData);
            setManufacturers(manufacturersData);
            setForms(formsData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    };

    const loadSubCategories = async (category: string) => {
        try {
            const subCategoriesData = await MedicineDatabaseService.getSubCategories(category);
            setSubCategories(subCategoriesData);
        } catch (error) {
            console.error('Error loading sub-categories:', error);
        }
    };

    const searchMedicines = async () => {
        try {
            setIsLoading(true);
            const result = await MedicineDatabaseService.searchMedicines(filters, currentPage, 20);
            setSearchResult(result);
        } catch (error) {
            console.error('Error searching medicines:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof MedicineSearchFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    const handleMedicineSelect = async (medicine: Medicine) => {
        setSelectedMedicine(medicine);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'limited':
                return 'bg-yellow-100 text-yellow-800';
            case 'out-of-stock':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderPagination = () => {
        const { page, totalPages } = searchResult;
        const pages = [];

        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2" data-oid="p6vj_f9">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    data-oid="qa6z5xv"
                >
                    Previous
                </button>

                {pages.map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 border rounded-lg ${
                            pageNum === page
                                ? 'bg-[#1F1F6F] text-white border-[#1F1F6F]'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        data-oid="5jnb-1e"
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    data-oid="0vdxesl"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <DashboardLayout
            title="Medicine Database"
            userType="prescription-reader"
            data-oid="kvgjlt_"
        >
            <div className="space-y-6" data-oid="2u3z160">
                {/* Database Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid=".7z.7s0">
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-6 rounded-xl"
                        data-oid="lij5l3m"
                    >
                        <div className="flex items-center justify-between" data-oid="xyohsf-">
                            <div data-oid="..-xwao">
                                <h3 className="text-lg font-semibold mb-2" data-oid="3n2chcc">
                                    Total Medicines
                                </h3>
                                <p className="text-3xl font-bold" data-oid="_q176j-">
                                    {stats.total}
                                </p>
                                <p className="text-sm opacity-80" data-oid="f4jes8b">
                                    In database
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="0h0uvmq">
                                💊
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
                        data-oid="wn:qp-."
                    >
                        <div className="flex items-center justify-between" data-oid="7b:mp_9">
                            <div data-oid="6ek0_.y">
                                <h3 className="text-lg font-semibold mb-2" data-oid="_m.vglh">
                                    Available
                                </h3>
                                <p className="text-3xl font-bold" data-oid="8zxa8c:">
                                    {stats.byAvailability.available || 0}
                                </p>
                                <p className="text-sm opacity-80" data-oid="547u:ud">
                                    In stock
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="inbhbbb">
                                ✅
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
                        data-oid="_7-77g_"
                    >
                        <div className="flex items-center justify-between" data-oid="32cztew">
                            <div data-oid="_ibawd9">
                                <h3 className="text-lg font-semibold mb-2" data-oid="-s5xno3">
                                    Prescription
                                </h3>
                                <p className="text-3xl font-bold" data-oid="2jt221b">
                                    {stats.prescriptionRequired}
                                </p>
                                <p className="text-sm opacity-80" data-oid="1a5:8ha">
                                    Rx required
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="tf.ka:f">
                                📋
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
                        data-oid="xtrgqhy"
                    >
                        <div className="flex items-center justify-between" data-oid="6mm2uco">
                            <div data-oid="beplg63">
                                <h3 className="text-lg font-semibold mb-2" data-oid="vk9tty.">
                                    OTC
                                </h3>
                                <p className="text-3xl font-bold" data-oid="fcjc0.6">
                                    {stats.overTheCounter}
                                </p>
                                <p className="text-sm opacity-80" data-oid=":7tmz1f">
                                    Over the counter
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="562r62u">
                                🛒
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    data-oid="5-b8v69"
                >
                    <div className="flex items-center justify-between mb-4" data-oid="gau02:j">
                        <h3 className="text-lg font-semibold text-gray-900" data-oid="-9u.oj8">
                            Search & Filters
                        </h3>
                        <div className="flex items-center space-x-2" data-oid="iw-wymp">
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="text-sm text-[#1F1F6F] hover:text-[#14274E] transition-colors duration-200"
                                data-oid="jk2r54j"
                            >
                                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                data-oid="syy91:q"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4" data-oid="p:3ovtj">
                        {/* Basic Search */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="0lyuz5d">
                            <div data-oid="ccvfn2m">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="v2:nd-l"
                                >
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={filters.search || ''}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Medicine name, generic, ingredient..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid=".qcp54k"
                                />
                            </div>

                            <div data-oid="079zxoc">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="3.-g2nz"
                                >
                                    Category
                                </label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="n97e_7b"
                                >
                                    <option value="" data-oid="5j_nbzm">
                                        All Categories
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category} value={category} data-oid="bdroejb">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div data-oid="gxi5al:">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="ppsrdjv"
                                >
                                    Availability
                                </label>
                                <select
                                    value={filters.availability || ''}
                                    onChange={(e) =>
                                        handleFilterChange('availability', e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="ffg6tqf"
                                >
                                    <option value="" data-oid="mlx5c_f">
                                        All Availability
                                    </option>
                                    <option value="available" data-oid="ffvj8z4">
                                        Available
                                    </option>
                                    <option value="limited" data-oid="kbcr-25">
                                        Limited
                                    </option>
                                    <option value="out-of-stock" data-oid="9ke7wwy">
                                        Out of Stock
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showAdvancedFilters && (
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
                                data-oid="vw0f9zj"
                            >
                                <div data-oid="9juj803">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="d9-om0q"
                                    >
                                        Sub-Category
                                    </label>
                                    <select
                                        value={filters.subCategory || ''}
                                        onChange={(e) =>
                                            handleFilterChange('subCategory', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        disabled={!filters.category}
                                        data-oid="4_16:xz"
                                    >
                                        <option value="" data-oid="b.n2gx0">
                                            All Sub-Categories
                                        </option>
                                        {subCategories.map((subCategory) => (
                                            <option
                                                key={subCategory}
                                                value={subCategory}
                                                data-oid="lr0qi:d"
                                            >
                                                {subCategory}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div data-oid="qx-zlgb">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="3_igroq"
                                    >
                                        Manufacturer
                                    </label>
                                    <select
                                        value={filters.manufacturer || ''}
                                        onChange={(e) =>
                                            handleFilterChange('manufacturer', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="5yyw.wk"
                                    >
                                        <option value="" data-oid="4sqzqhb">
                                            All Manufacturers
                                        </option>
                                        {manufacturers.map((manufacturer) => (
                                            <option
                                                key={manufacturer}
                                                value={manufacturer}
                                                data-oid="lg_apn-"
                                            >
                                                {manufacturer}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div data-oid="p:5tway">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="8y6mwaf"
                                    >
                                        Form
                                    </label>
                                    <select
                                        value={filters.form || ''}
                                        onChange={(e) => handleFilterChange('form', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid=".9paw6n"
                                    >
                                        <option value="" data-oid="ac3ih3u">
                                            All Forms
                                        </option>
                                        {forms.map((form) => (
                                            <option key={form} value={form} data-oid="unu23a-">
                                                {form}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div data-oid=".1iszlg">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="hq92r1n"
                                    >
                                        Prescription
                                    </label>
                                    <select
                                        value={
                                            filters.prescriptionRequired === undefined
                                                ? ''
                                                : filters.prescriptionRequired.toString()
                                        }
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'prescriptionRequired',
                                                e.target.value === ''
                                                    ? undefined
                                                    : e.target.value === 'true',
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="x4cfrwy"
                                    >
                                        <option value="" data-oid="es_tb2b">
                                            All Types
                                        </option>
                                        <option value="true" data-oid="e8_hq9-">
                                            Prescription Required
                                        </option>
                                        <option value="false" data-oid="idbyrly">
                                            Over the Counter
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div
                    className={`grid ${selectedMedicine ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}
                    data-oid="lf733jb"
                >
                    {/* Medicine List */}
                    <div
                        className="bg-white rounded-lg shadow-sm border border-gray-200"
                        data-oid="dyjpq7e"
                    >
                        <div className="p-6 border-b border-gray-200" data-oid=":6q:_:v">
                            <div className="flex items-center justify-between" data-oid="fy-2utj">
                                <h3
                                    className="text-lg font-semibold text-gray-900"
                                    data-oid="tmkvg37"
                                >
                                    Search Results ({searchResult.total})
                                </h3>
                                <button
                                    onClick={searchMedicines}
                                    disabled={isLoading}
                                    className="px-3 py-1 bg-[#1F1F6F] hover:bg-[#14274E] text-white text-sm rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    data-oid="ycd:nnl"
                                >
                                    {isLoading ? 'Searching...' : 'Refresh'}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-oid="um1udgt">
                                Page {searchResult.page} of {searchResult.totalPages}
                            </p>
                        </div>

                        <div className="p-6" data-oid="d5p57vy">
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center py-8"
                                    data-oid="j5l7wue"
                                >
                                    <div
                                        className="w-6 h-6 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                        data-oid="amuibjh"
                                    ></div>
                                    <span className="ml-3 text-gray-600" data-oid="-7ruq9_">
                                        Searching medicines...
                                    </span>
                                </div>
                            ) : searchResult.medicines.length === 0 ? (
                                <div className="text-center py-12" data-oid="24uf1rt">
                                    <div
                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        data-oid="r:i_pdm"
                                    >
                                        <span className="text-2xl" data-oid="h4:dnml">
                                            💊
                                        </span>
                                    </div>
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="51ax1yc"
                                    >
                                        No Medicines Found
                                    </h3>
                                    <p className="text-gray-600" data-oid="jfa897y">
                                        Try adjusting your search criteria
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-[#1F1F6F] hover:text-[#14274E] font-medium transition-colors duration-200"
                                        data-oid="fuzz6fh"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4" data-oid="o8em2jv">
                                    {searchResult.medicines.map((medicine) => (
                                        <div
                                            key={medicine.id}
                                            className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                                                selectedMedicine?.id === medicine.id
                                                    ? 'border-[#1F1F6F] bg-blue-50'
                                                    : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                                            }`}
                                            onClick={() => handleMedicineSelect(medicine)}
                                            data-oid="6kzke2g"
                                        >
                                            <div
                                                className="flex items-start justify-between mb-3"
                                                data-oid="q8c4nf3"
                                            >
                                                <div data-oid="gojowqu">
                                                    <h4
                                                        className="font-semibold text-gray-900"
                                                        data-oid=":9heq33"
                                                    >
                                                        {medicine.name}
                                                    </h4>
                                                    {medicine.genericName && (
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="_d9q79p"
                                                        >
                                                            Generic: {medicine.genericName}
                                                        </p>
                                                    )}
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="q_uz4i8"
                                                    >
                                                        Manufacturer: {medicine.manufacturer}
                                                    </p>
                                                </div>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="6lgmrnu"
                                                >
                                                    <span
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                                                        data-oid="w06f-mi"
                                                    >
                                                        {medicine.category}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(medicine.availability)}`}
                                                        data-oid="r:pnvus"
                                                    >
                                                        {medicine.availability}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3"
                                                data-oid="_dv39_o"
                                            >
                                                <div data-oid="yk._n.h">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="1n1wq67"
                                                    >
                                                        Form:
                                                    </span>{' '}
                                                    {medicine.form}
                                                </div>
                                                <div data-oid="wdnvo3m">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="ypd88mq"
                                                    >
                                                        Strength:
                                                    </span>{' '}
                                                    {medicine.strength}
                                                </div>
                                                <div data-oid="8n34-n2">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="nymcw8p"
                                                    >
                                                        Price:
                                                    </span>{' '}
                                                    EGP {medicine.price.toFixed(2)}
                                                </div>
                                                <div data-oid="ya:wa4g">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="rb1pjeo"
                                                    >
                                                        Rx Required:
                                                    </span>{' '}
                                                    {medicine.prescriptionRequired ? 'Yes' : 'No'}
                                                </div>
                                            </div>

                                            <p
                                                className="text-sm text-gray-600 mb-3"
                                                data-oid=".nnr9n_"
                                            >
                                                {medicine.description}
                                            </p>

                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="s89_.a:"
                                            >
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="zsmh0du"
                                                >
                                                    {medicine.prescriptionRequired && (
                                                        <span
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                            data-oid="v3mf2d_"
                                                        >
                                                            📋 Rx Required
                                                        </span>
                                                    )}
                                                    {medicine.availability === 'limited' && (
                                                        <span
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                                            data-oid=".gvq9cx"
                                                        >
                                                            ⚠️ Limited Stock
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMedicineSelect(medicine);
                                                    }}
                                                    className="text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm transition-colors duration-200"
                                                    data-oid="q4zfl2v"
                                                >
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination */}
                                    {searchResult.totalPages > 1 && (
                                        <div
                                            className="pt-6 border-t border-gray-200"
                                            data-oid="z-6jmgg"
                                        >
                                            {renderPagination()}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medicine Details Panel */}
                    {selectedMedicine && (
                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200"
                            data-oid="m5yiv08"
                        >
                            <div className="p-6 border-b border-gray-200" data-oid="zl7_vr5">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="-l9t27o"
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="dpjgtdr"
                                    >
                                        Medicine Details
                                    </h3>
                                    <button
                                        onClick={() => setSelectedMedicine(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        data-oid="_5r2ahp"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="bncaljw"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                                data-oid="jcd5-9j"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 max-h-[600px] overflow-y-auto" data-oid="uur3v8h">
                                <div className="space-y-6" data-oid="ra:_3dx">
                                    {/* Basic Information */}
                                    <div data-oid="0fhd4b3">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="-mftmao"
                                        >
                                            Basic Information
                                        </h4>
                                        <div
                                            className="grid grid-cols-2 gap-4 text-sm"
                                            data-oid="q2fhrah"
                                        >
                                            <div data-oid="ujex4zw">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="qza9jo3"
                                                >
                                                    Name:
                                                </span>
                                                <p className="text-gray-900" data-oid="chpevg6">
                                                    {selectedMedicine.name}
                                                </p>
                                            </div>
                                            <div data-oid="fnwmasc">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="1cky4ol"
                                                >
                                                    Generic Name:
                                                </span>
                                                <p className="text-gray-900" data-oid="39ylj-s">
                                                    {selectedMedicine.genericName || 'N/A'}
                                                </p>
                                            </div>
                                            <div data-oid="-9j17qk">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="dv9rid2"
                                                >
                                                    Active Ingredient:
                                                </span>
                                                <p className="text-gray-900" data-oid="txdigoj">
                                                    {selectedMedicine.activeIngredient}
                                                </p>
                                            </div>
                                            <div data-oid="2ggiqji">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="vlgq-ul"
                                                >
                                                    Strength:
                                                </span>
                                                <p className="text-gray-900" data-oid="xly7m2e">
                                                    {selectedMedicine.strength}
                                                </p>
                                            </div>
                                            <div data-oid="c2tyxym">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="r8.fo9x"
                                                >
                                                    Form:
                                                </span>
                                                <p className="text-gray-900" data-oid="445r90i">
                                                    {selectedMedicine.form}
                                                </p>
                                            </div>
                                            <div data-oid="iq3ba18">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="7o6t1zb"
                                                >
                                                    Manufacturer:
                                                </span>
                                                <p className="text-gray-900" data-oid="djez68y">
                                                    {selectedMedicine.manufacturer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Brand Names */}
                                    {selectedMedicine.brandNames.length > 0 && (
                                        <div data-oid="f2caogr">
                                            <h4
                                                className="font-semibold text-gray-900 mb-3"
                                                data-oid="ws4qnpy"
                                            >
                                                Brand Names
                                            </h4>
                                            <div
                                                className="flex flex-wrap gap-2"
                                                data-oid="cs0odyj"
                                            >
                                                {selectedMedicine.brandNames.map((brand, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                                                        data-oid="a-_cj5_"
                                                    >
                                                        {brand}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div data-oid="fle72mj">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="4kcohj9"
                                        >
                                            Description
                                        </h4>
                                        <p className="text-gray-700" data-oid="::dzo6:">
                                            {selectedMedicine.description}
                                        </p>
                                    </div>

                                    {/* Indications */}
                                    <div data-oid="gp9ymuk">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="_iu2s57"
                                        >
                                            Indications
                                        </h4>
                                        <ul
                                            className="list-disc list-inside space-y-1 text-gray-700"
                                            data-oid="tfte5g9"
                                        >
                                            {selectedMedicine.indications.map(
                                                (indication, index) => (
                                                    <li key={index} data-oid="6uu:qfb">
                                                        {indication}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    {/* Dosage Instructions */}
                                    <div data-oid="fr06a-_">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="2rgkl-n"
                                        >
                                            Dosage Instructions
                                        </h4>
                                        <p className="text-gray-700" data-oid="9y.nbeb">
                                            {selectedMedicine.dosageInstructions}
                                        </p>
                                    </div>

                                    {/* Contraindications */}
                                    <div data-oid="-5k0v:-">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="1o7:h_5"
                                        >
                                            Contraindications
                                        </h4>
                                        <ul
                                            className="list-disc list-inside space-y-1 text-red-700"
                                            data-oid=":k2l.fe"
                                        >
                                            {selectedMedicine.contraindications.map(
                                                (contraindication, index) => (
                                                    <li key={index} data-oid=":7ti4z.">
                                                        {contraindication}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    {/* Side Effects */}
                                    <div data-oid="c3ldqfr">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="emt7qax"
                                        >
                                            Side Effects
                                        </h4>
                                        <ul
                                            className="list-disc list-inside space-y-1 text-orange-700"
                                            data-oid="axi.g5w"
                                        >
                                            {selectedMedicine.sideEffects.map(
                                                (sideEffect, index) => (
                                                    <li key={index} data-oid="-ukd_8s">
                                                        {sideEffect}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    {/* Drug Interactions */}
                                    <div data-oid="b2a_uzz">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="w_4ctm2"
                                        >
                                            Drug Interactions
                                        </h4>
                                        <ul
                                            className="list-disc list-inside space-y-1 text-purple-700"
                                            data-oid=":2tuvq9"
                                        >
                                            {selectedMedicine.interactions.map(
                                                (interaction, index) => (
                                                    <li key={index} data-oid="hufdycg">
                                                        {interaction}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    {/* Storage Conditions */}
                                    <div data-oid="rf2-0ao">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="39brmfr"
                                        >
                                            Storage Conditions
                                        </h4>
                                        <p className="text-gray-700" data-oid="n4-gir7">
                                            {selectedMedicine.storageConditions}
                                        </p>
                                    </div>

                                    {/* Pricing and Availability */}
                                    <div data-oid="y--r7dd">
                                        <h4
                                            className="font-semibold text-gray-900 mb-3"
                                            data-oid="12g1_qe"
                                        >
                                            Pricing & Availability
                                        </h4>
                                        <div
                                            className="grid grid-cols-2 gap-4 text-sm"
                                            data-oid="uj6_qzh"
                                        >
                                            <div data-oid="s-ebz.7">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="o5na5wt"
                                                >
                                                    Price:
                                                </span>
                                                <p
                                                    className="text-gray-900 font-bold"
                                                    data-oid="ldz2_b8"
                                                >
                                                    EGP {selectedMedicine.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div data-oid="-z0kzsw">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="9pxt3mo"
                                                >
                                                    Availability:
                                                </span>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(selectedMedicine.availability)}`}
                                                    data-oid="e1qrozy"
                                                >
                                                    {selectedMedicine.availability}
                                                </span>
                                            </div>
                                            <div data-oid="m5fta2.">
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="-bkg3.d"
                                                >
                                                    Prescription Required:
                                                </span>
                                                <p className="text-gray-900" data-oid="fxmm6sa">
                                                    {selectedMedicine.prescriptionRequired
                                                        ? 'Yes'
                                                        : 'No'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
