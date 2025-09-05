'use client';

import { useState, useEffect } from 'react';
import { products, Product } from '@/lib/data/products';
import { MedicineDataManager, ExtendedMedicine } from '@/lib/data/medicineData';

interface MedicineSearchModalProps {
    onSelect: (medicine: ExtendedMedicine | Product) => void;
    onClose: () => void;
}

export function MedicineSearchModal({ onSelect, onClose }: MedicineSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'products' | 'medicines'>('products');

    // Get all available categories from products
    const productCategories = Array.from(new Set(products.map((p) => p.category))).sort();
    const medicineCategories = Array.from(
        new Set(MedicineDataManager.getPopularMedicines().map((m) => m.category)),
    ).sort();

    useEffect(() => {
        filterItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, selectedCategory, activeTab]);

    const filterItems = () => {
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            if (activeTab === 'products') {
                let filtered = products;

                if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    filtered = filtered.filter(
                        (product) =>
                            product.name.toLowerCase().includes(term) ||
                            product.nameAr.toLowerCase().includes(term) ||
                            product.activeIngredient.toLowerCase().includes(term) ||
                            product.manufacturer.toLowerCase().includes(term) ||
                            product.description.toLowerCase().includes(term),
                    );
                }

                if (selectedCategory) {
                    filtered = filtered.filter((product) => product.category === selectedCategory);
                }

                setFilteredProducts(filtered);
            }
            setIsLoading(false);
        }, 300);
    };

    const handleSelect = (item: ExtendedMedicine | Product) => {
        onSelect(item);
        onClose();
    };

    const allMedicines = MedicineDataManager.getPopularMedicines();
    const filteredMedicines = allMedicines.filter((medicine) => {
        const matchesSearch =
            !searchTerm ||
            medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = !selectedCategory || medicine.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            data-oid="v7ymocg"
        >
            <div
                className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
                data-oid="a9wxmq_"
            >
                {/* Header with Cura Branding */}
                <div
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] p-6 text-white"
                    data-oid="6g8vh_s"
                >
                    <div className="flex items-center justify-between" data-oid="chb.hg.">
                        <div data-oid="ujri87s">
                            <h2 className="text-2xl font-bold mb-2" data-oid="70_eut8">
                                🏥 Cura Medicine Database
                            </h2>
                            <p className="text-blue-100" data-oid="8f1wfqy">
                                Search and select medicines from our comprehensive database
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-blue-200 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                            data-oid="-:9mmdb"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="b.5biej"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="zjc81v2"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gray-50" data-oid="4o945gb">
                    <div className="flex" data-oid="fvzc8u2">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'products'
                                    ? 'border-b-2 border-[#1F1F6F] text-[#1F1F6F] bg-white'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="xk6qksq"
                        >
                            🛒 All Products ({products.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('medicines')}
                            className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'medicines'
                                    ? 'border-b-2 border-[#1F1F6F] text-[#1F1F6F] bg-white'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="-ggtrw-"
                        >
                            💊 Medicine Database ({allMedicines.length})
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="p-6 border-b border-gray-200 bg-white" data-oid="bpvm2vq">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="w436gms">
                        <div data-oid="u3b62wd">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="2w4jovk"
                            >
                                🔍 Search {activeTab === 'products' ? 'Products' : 'Medicines'}
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Search by name, ingredient, manufacturer...`}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent transition-all duration-200"
                                data-oid="i868z59"
                            />
                        </div>
                        <div data-oid="1hwho.6">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="ozg7.rz"
                            >
                                📂 Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent transition-all duration-200"
                                data-oid="uwwky8p"
                            >
                                <option value="" data-oid="96g6-xi">
                                    All Categories
                                </option>
                                {(activeTab === 'products'
                                    ? productCategories
                                    : medicineCategories
                                ).map((category) => (
                                    <option key={category} value={category} data-oid="8zcb3hn">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="p-6 overflow-y-auto max-h-[50vh] bg-gray-50" data-oid="-.7ww.c">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12" data-oid="jvw.6:b">
                            <div
                                className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                data-oid="jrp_o88"
                            ></div>
                            <span className="ml-3 text-gray-600 font-medium" data-oid="1ie_.gg">
                                Searching database...
                            </span>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'products' ? (
                                filteredProducts.length === 0 ? (
                                    <div className="text-center py-12" data-oid="8-642rs">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="kc9a8h0"
                                        >
                                            <span className="text-2xl" data-oid="kczs:on">
                                                🔍
                                            </span>
                                        </div>
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-2"
                                            data-oid="mkkts0e"
                                        >
                                            No Products Found
                                        </h3>
                                        <p className="text-gray-600" data-oid="l0n_k:d">
                                            Try adjusting your search criteria
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        data-oid="zh0g9k4"
                                    >
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                                onClick={() => handleSelect(product)}
                                                data-oid="1v1a18c"
                                            >
                                                {/* Product Image */}
                                                <div
                                                    className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                                                    data-oid="o.eepyh"
                                                >
                                                    {product.image &&
                                                    product.image !== '/api/placeholder/300/300' ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            data-oid="r_nzk4h"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="text-4xl"
                                                            data-oid="0l:jiub"
                                                        >
                                                            💊
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="space-y-2" data-oid="3t_nesl">
                                                    <div
                                                        className="flex items-start justify-between"
                                                        data-oid="p..0he7"
                                                    >
                                                        <h4
                                                            className="font-semibold text-gray-900 text-sm leading-tight"
                                                            data-oid=":.i8ho2"
                                                        >
                                                            {product.name}
                                                        </h4>
                                                        <span
                                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
                                                            data-oid="juvp-7."
                                                        >
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-2 gap-2 text-xs text-gray-600"
                                                        data-oid="g7zghu5"
                                                    >
                                                        <div data-oid="vuesp6g">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="c29eve:"
                                                            >
                                                                Manufacturer:
                                                            </span>
                                                            <p
                                                                className="truncate"
                                                                data-oid="75gv0z8"
                                                            >
                                                                {product.manufacturer}
                                                            </p>
                                                        </div>
                                                        <div data-oid="7o4:-5r">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="sx674i6"
                                                            >
                                                                Pharmacy:
                                                            </span>
                                                            <p
                                                                className="truncate"
                                                                data-oid="d0.ryzw"
                                                            >
                                                                {product.pharmacy}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="text-xs text-gray-600"
                                                        data-oid="kij0jdl"
                                                    >
                                                        <span
                                                            className="font-medium"
                                                            data-oid="og5au3g"
                                                        >
                                                            Active Ingredient:
                                                        </span>
                                                        <p className="truncate" data-oid="aqd4cbx">
                                                            {product.activeIngredient}
                                                        </p>
                                                    </div>

                                                    {product.description && (
                                                        <p
                                                            className="text-xs text-gray-600 line-clamp-2"
                                                            data-oid="qvxossl"
                                                        >
                                                            {product.description}
                                                        </p>
                                                    )}

                                                    <div
                                                        className="flex items-center justify-between pt-2 border-t border-gray-100"
                                                        data-oid="7zwy:xe"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="9kaha5u"
                                                        >
                                                            <span
                                                                className="text-lg font-bold text-[#1F1F6F]"
                                                                data-oid="k.:r7rn"
                                                            >
                                                                EGP {product.price.toFixed(2)}
                                                            </span>
                                                            {product.originalPrice && (
                                                                <span
                                                                    className="text-xs text-gray-500 line-through"
                                                                    data-oid="1km7irx"
                                                                >
                                                                    EGP{' '}
                                                                    {product.originalPrice.toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                product.availability.inStock
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                            data-oid="6eww.ie"
                                                        >
                                                            {product.availability.inStock
                                                                ? '✅ In Stock'
                                                                : '❌ Out of Stock'}
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="w-full mt-3 bg-[#1F1F6F] hover:bg-[#14274E] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group-hover:bg-[#14274E]"
                                                        data-oid="g5nn3n5"
                                                    >
                                                        Select Product
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : filteredMedicines.length === 0 ? (
                                <div className="text-center py-12" data-oid="fothe0j">
                                    <div
                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        data-oid="3c9rl1f"
                                    >
                                        <span className="text-2xl" data-oid="56.lxz-">
                                            💊
                                        </span>
                                    </div>
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="g1qa4d_"
                                    >
                                        No Medicines Found
                                    </h3>
                                    <p className="text-gray-600" data-oid="30ib75m">
                                        Try adjusting your search criteria
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    data-oid="rcjhylm"
                                >
                                    {filteredMedicines.map((medicine) => (
                                        <div
                                            key={medicine.id}
                                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                            onClick={() => handleSelect(medicine)}
                                            data-oid="19yjk_3"
                                        >
                                            <div
                                                className="flex items-start space-x-4"
                                                data-oid="4a:7zz5"
                                            >
                                                {/* Medicine Image */}
                                                <div
                                                    className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    data-oid="5ss3nbk"
                                                >
                                                    {medicine.image ? (
                                                        <img
                                                            src={medicine.image}
                                                            alt={medicine.name}
                                                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                            data-oid="3i04c-g"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="text-2xl"
                                                            data-oid="7f9rd1i"
                                                        >
                                                            💊
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Medicine Info */}
                                                <div
                                                    className="flex-1 space-y-2"
                                                    data-oid="_ba:sqb"
                                                >
                                                    <div
                                                        className="flex items-start justify-between"
                                                        data-oid="oftz1to"
                                                    >
                                                        <h4
                                                            className="font-semibold text-gray-900 leading-tight"
                                                            data-oid="zwp7vas"
                                                        >
                                                            {medicine.name}
                                                        </h4>
                                                        <span
                                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
                                                            data-oid=":at0ieu"
                                                        >
                                                            {medicine.category}
                                                        </span>
                                                    </div>

                                                    {medicine.genericName && (
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="2h-r._w"
                                                        >
                                                            Generic: {medicine.genericName}
                                                        </p>
                                                    )}

                                                    <div
                                                        className="grid grid-cols-2 gap-2 text-sm text-gray-600"
                                                        data-oid="joa67_."
                                                    >
                                                        <div data-oid="gbhuu:7">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="5sfxqhg"
                                                            >
                                                                Strength:
                                                            </span>{' '}
                                                            {medicine.strength}
                                                        </div>
                                                        <div data-oid="h81mtq1">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="jyzwel4"
                                                            >
                                                                Form:
                                                            </span>{' '}
                                                            {medicine.form}
                                                        </div>
                                                        <div data-oid="2ed2:p-">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="xddezfb"
                                                            >
                                                                Manufacturer:
                                                            </span>{' '}
                                                            {medicine.manufacturer}
                                                        </div>
                                                        <div data-oid="8da0ob9">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="89zj3rs"
                                                            >
                                                                Prescription:
                                                            </span>{' '}
                                                            {medicine.requiresPrescription
                                                                ? 'Required'
                                                                : 'OTC'}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="text-sm text-gray-600"
                                                        data-oid="216h.3m"
                                                    >
                                                        <span
                                                            className="font-medium"
                                                            data-oid="lz40m.6"
                                                        >
                                                            Active Ingredient:
                                                        </span>{' '}
                                                        {medicine.activeIngredient}
                                                    </div>

                                                    {medicine.description && (
                                                        <p
                                                            className="text-sm text-gray-600 line-clamp-2"
                                                            data-oid="igenv.."
                                                        >
                                                            {medicine.description}
                                                        </p>
                                                    )}

                                                    <div
                                                        className="flex items-center justify-between pt-2 border-t border-gray-100"
                                                        data-oid="q5.-xk_"
                                                    >
                                                        <div
                                                            className="text-lg font-bold text-[#1F1F6F]"
                                                            data-oid="95nvbk-"
                                                        >
                                                            EGP{' '}
                                                            {medicine.pharmacyMapping.averagePrice.toFixed(
                                                                2,
                                                            )}
                                                            <span
                                                                className="text-xs text-gray-500 font-normal ml-1"
                                                                data-oid="bfepw5u"
                                                            >
                                                                (avg price)
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-500"
                                                            data-oid="oe7lp0r"
                                                        >
                                                            {
                                                                medicine.pharmacyMapping
                                                                    .availabilityPercentage
                                                            }
                                                            % available
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="w-full mt-3 bg-[#1F1F6F] hover:bg-[#14274E] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group-hover:bg-[#14274E]"
                                                        data-oid="d:32yh:"
                                                    >
                                                        Select Medicine
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer with Cura Branding */}
                <div className="p-6 border-t border-gray-200 bg-white" data-oid="i1z87qm">
                    <div className="flex items-center justify-between" data-oid="1iv24ub">
                        <div className="flex items-center space-x-4" data-oid="2iwzbk5">
                            <p className="text-sm text-gray-600" data-oid="h30g54b">
                                {activeTab === 'products'
                                    ? `${filteredProducts.length} product(s) found`
                                    : `${filteredMedicines.length} medicine(s) found`}
                            </p>
                            <div className="text-xs text-gray-500" data-oid="b9:f7gm">
                                🏥 Powered by Cura Medicine Database
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            data-oid="653jx6j"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
