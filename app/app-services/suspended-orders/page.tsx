'use client';

export default function SuspendedOrdersPage() {
    return (
        <div className="space-y-6" data-oid="tq9yudo">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="p91wog7">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="93ca0cb">
                    Suspended Orders Management
                </h1>
                <p className="text-gray-600" data-oid="0015i-r">
                    Handle and resolve suspended prescription orders
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="v3f8wh1">
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="x.0g50x">
                    <div className="text-center" data-oid="linxpo3">
                        <div className="text-3xl font-bold text-red-600" data-oid="f9q:tiw">
                            3
                        </div>
                        <div className="text-sm text-gray-600" data-oid="uab7lsm">
                            New Suspended
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="oe2c3ts">
                    <div className="text-center" data-oid="_y63b1b">
                        <div className="text-3xl font-bold text-yellow-600" data-oid="wvcew-r">
                            2
                        </div>
                        <div className="text-sm text-gray-600" data-oid="v_jwx3p">
                            In Progress
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="zalg68t">
                    <div className="text-center" data-oid="bq.985f">
                        <div className="text-3xl font-bold text-green-600" data-oid="l23bw0b">
                            12
                        </div>
                        <div className="text-sm text-gray-600" data-oid="40he:ea">
                            Resolved Today
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="j8ap3t1">
                    <div className="text-center" data-oid="b3p49nc">
                        <div className="text-3xl font-bold text-blue-600" data-oid="ly_6f9s">
                            4.2h
                        </div>
                        <div className="text-sm text-gray-600" data-oid="36enwk:">
                            Avg Resolution
                        </div>
                    </div>
                </div>
            </div>

            {/* Suspended Orders List */}
            <div className="bg-white rounded-xl border border-gray-200" data-oid="ajrdg3f">
                <div className="p-4 border-b border-gray-200" data-oid="r.1h1s-">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="x908930">
                        Active Suspended Orders
                    </h3>
                </div>
                <div className="space-y-4 p-6" data-oid=":ihyqxm">
                    {/* Order 1 */}
                    <div className="border border-gray-200 rounded-xl p-4" data-oid="luwy44m">
                        <div className="flex items-start justify-between mb-4" data-oid="n9or967">
                            <div data-oid="zrsvb8f">
                                <h4 className="font-semibold text-gray-900" data-oid="1:ohrhm">
                                    CURA-240115-001
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="aaw:ay_">
                                    Customer: Ahmed Mohamed • Phone: +20 10 1234 5678
                                </p>
                                <p className="text-sm text-gray-600" data-oid="991x3l7">
                                    Pharmacy: HealthPlus Pharmacy • Phone: +20 64 123 4567
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="xfi77mo">
                                <span
                                    className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                                    data-oid="vj:7l0s"
                                >
                                    SUSPENDED
                                </span>
                                <span
                                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                    data-oid="v99wj2u"
                                >
                                    PRESCRIPTION ISSUE
                                </span>
                            </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 mb-4" data-oid="dnjd2vu">
                            <h5 className="font-medium text-red-800 mb-1" data-oid="78kcv34">
                                Issue Details:
                            </h5>
                            <p className="text-sm text-red-700" data-oid="sxphcoj">
                                Prescription image is unclear, cannot read dosage for Amoxicillin.
                                Customer needs to provide clearer image or visit pharmacy.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2" data-oid="aa:iga-">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-oid="4331x0w"
                            >
                                📞 Contact Customer
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                data-oid="ri6ygti"
                            >
                                🏥 Contact Pharmacy
                            </button>
                            <button
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                data-oid="trqpj-7"
                            >
                                🔺 Escalate
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                data-oid="8zqbbth"
                            >
                                ✅ Mark Resolved
                            </button>
                        </div>
                    </div>

                    {/* Order 2 */}
                    <div className="border border-gray-200 rounded-xl p-4" data-oid="cya8i60">
                        <div className="flex items-start justify-between mb-4" data-oid="2392k0n">
                            <div data-oid="mrr6z5m">
                                <h4 className="font-semibold text-gray-900" data-oid="-zbmwlv">
                                    CURA-240115-002
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="-_wuo8w">
                                    Customer: Fatima Ali • Phone: +20 11 2345 6789
                                </p>
                                <p className="text-sm text-gray-600" data-oid="cybgu_q">
                                    Pharmacy: WellCare Pharmacy • Phone: +20 64 234 5678
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="utnyf7f">
                                <span
                                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                                    data-oid="2p:2pat"
                                >
                                    IN PROGRESS
                                </span>
                                <span
                                    className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                                    data-oid="tzvlc3_"
                                >
                                    MEDICINE UNAVAILABLE
                                </span>
                                <span
                                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                    data-oid="fl.dsxx"
                                >
                                    🔺 URGENT
                                </span>
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 mb-4" data-oid=":6muzu0">
                            <h5 className="font-medium text-yellow-800 mb-1" data-oid="0n4zh_t">
                                Issue Details:
                            </h5>
                            <p className="text-sm text-yellow-700" data-oid="yzkntp:">
                                Insulin pen is out of stock. Customer needs urgent alternative or
                                transfer to another pharmacy.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4" data-oid="1apm26k">
                            <div data-oid="tbiyctg">
                                <h6 className="font-medium text-gray-900 mb-2" data-oid="igqzp0s">
                                    Customer Contact:
                                </h6>
                                <div
                                    className="p-2 bg-green-100 text-green-800 rounded-lg text-sm"
                                    data-oid="h_kpfu8"
                                >
                                    ✅ Contacted at 2:30 PM
                                </div>
                            </div>
                            <div data-oid="d-kvww3">
                                <h6 className="font-medium text-gray-900 mb-2" data-oid="r2dpvic">
                                    Pharmacy Contact:
                                </h6>
                                <div
                                    className="p-2 bg-green-100 text-green-800 rounded-lg text-sm"
                                    data-oid="q-swbdd"
                                >
                                    ✅ Contacted at 2:15 PM
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2" data-oid="aipj_zr">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-oid="rjavtfw"
                            >
                                🔄 Find Alternative
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                data-oid="_xm4:uw"
                            >
                                🏥 Transfer Pharmacy
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                data-oid=".-29kd:"
                            >
                                ✅ Mark Resolved
                            </button>
                        </div>
                    </div>

                    {/* Order 3 */}
                    <div className="border border-gray-200 rounded-xl p-4" data-oid="t1jbv:r">
                        <div className="flex items-start justify-between mb-4" data-oid="dvykna2">
                            <div data-oid="lp-1vxj">
                                <h4 className="font-semibold text-gray-900" data-oid="xgo3kt2">
                                    CURA-240115-003
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="rpj2p:5">
                                    Customer: Omar Hassan • Phone: +20 12 3456 7890
                                </p>
                                <p className="text-sm text-gray-600" data-oid="r:_9x2a">
                                    Pharmacy: Family Care Pharmacy • Phone: +20 64 345 6789
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="t8zx693">
                                <span
                                    className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                                    data-oid="rl6l8q7"
                                >
                                    SUSPENDED
                                </span>
                                <span
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                    data-oid="q:.gcky"
                                >
                                    CUSTOMER REQUEST
                                </span>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 mb-4" data-oid="sic9:a4">
                            <h5 className="font-medium text-blue-800 mb-1" data-oid="y10-9uz">
                                Issue Details:
                            </h5>
                            <p className="text-sm text-blue-700" data-oid="kp35cw2">
                                Customer wants to change baby formula brand after placing order.
                                Requesting substitution.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2" data-oid="6.nlza9">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-oid="54igkyu"
                            >
                                📞 Contact Customer
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                data-oid="u19afx2"
                            >
                                ✏️ Modify Order
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                data-oid="mzxykl0"
                            >
                                ❌ Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
