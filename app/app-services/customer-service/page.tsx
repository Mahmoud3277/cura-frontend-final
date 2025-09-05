export default function CustomerServicePage() {
    return (
        <div className="space-y-6" data-oid="pn1y2w.">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="0a4t3pd">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="k31xz1d">
                    Customer Service Center
                </h1>
                <p className="text-gray-600" data-oid="nfrwiud">
                    Handle customer tickets, complaints, and support requests
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="qg430d-">
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="eazzgyb">
                    <div className="text-center" data-oid="e.2w0__">
                        <div className="text-3xl font-bold text-red-600" data-oid="8.nvs_k">
                            5
                        </div>
                        <div className="text-sm text-gray-600" data-oid="0nzr8qx">
                            Open Tickets
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="ued-761">
                    <div className="text-center" data-oid="igi3-6:">
                        <div className="text-3xl font-bold text-yellow-600" data-oid="o73_n7q">
                            3
                        </div>
                        <div className="text-sm text-gray-600" data-oid="hncjxfi">
                            In Progress
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="azjf.x_">
                    <div className="text-center" data-oid="m233wpt">
                        <div className="text-3xl font-bold text-green-600" data-oid="us.k-9p">
                            18
                        </div>
                        <div className="text-sm text-gray-600" data-oid="310roxn">
                            Resolved Today
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="hb9ll:2">
                    <div className="text-center" data-oid="9_e.srz">
                        <div className="text-3xl font-bold text-blue-600" data-oid=".jxb9nh">
                            4.6
                        </div>
                        <div className="text-sm text-gray-600" data-oid="3d8wpap">
                            Satisfaction
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Service Tickets */}
            <div className="bg-white rounded-xl border border-gray-200" data-oid="0-bkdd2">
                <div className="p-4 border-b border-gray-200" data-oid="_aayqu5">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="dj4tpu_">
                        Active Customer Tickets
                    </h3>
                </div>
                <div className="space-y-4 p-6" data-oid="n2noe1x">
                    {/* Ticket 1 */}
                    <div className="border border-gray-200 rounded-xl p-4" data-oid="a7yge4t">
                        <div className="flex items-start justify-between mb-4" data-oid="1hfh_3j">
                            <div data-oid="hn84lmj">
                                <h4 className="font-semibold text-gray-900" data-oid="wqkaxdt">
                                    CS-2024-001
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="amg243h">
                                    Customer: Ahmed Hassan • Phone: +20 100 123 4567
                                </p>
                                <p className="text-sm text-gray-600" data-oid="-6s24kw">
                                    Subject: Order delivery delay
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="_8:sqfe">
                                <span
                                    className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                                    data-oid="01ror3l"
                                >
                                    HIGH PRIORITY
                                </span>
                                <span
                                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                                    data-oid="pnfliw7"
                                >
                                    OPEN
                                </span>
                                <span
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                    data-oid="xtg:eav"
                                >
                                    ORDER
                                </span>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 mb-4" data-oid="9xqw15z">
                            <h5 className="font-medium text-blue-800 mb-1" data-oid="c4hng-b">
                                Customer Message:
                            </h5>
                            <p className="text-sm text-blue-700" data-oid="5ti2jdz">
                                {'"'}My order was supposed to be delivered 2 hours ago but I haven{"'"}t
                                received it yet. Order number: CURA{"-"}240115{"-"}001{'"'}
                            </p>
                        </div>
                        <div className="mb-4" data-oid="ca5qvyi">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="md9i2g2"
                            >
                                Response:
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Type your response to the customer..."
                                data-oid="eyxla7j"
                            ></textarea>
                        </div>
                        <div className="flex flex-wrap gap-2" data-oid="oqb74hz">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-oid="bqencuf"
                            >
                                📧 Send Response
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                data-oid="3frrdiu"
                            >
                                📞 Call Customer
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                data-oid="kqs8_gs"
                            >
                                🔄 Transfer
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                data-oid=":_ngdrb"
                            >
                                ✅ Resolve
                            </button>
                        </div>
                    </div>

                    {/* Ticket 2 */}
                    <div className="border border-gray-200 rounded-xl p-4" data-oid="lk5uwts">
                        <div className="flex items-start justify-between mb-4" data-oid="fwqg3nz">
                            <div data-oid="7vfprb1">
                                <h4 className="font-semibold text-gray-900" data-oid="6sk74yf">
                                    CS-2024-002
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="ry0ujh9">
                                    Customer: Fatima Ali • Phone: +20 101 234 5678
                                </p>
                                <p className="text-sm text-gray-600" data-oid="60oxiqr">
                                    Subject: Prescription reading error
                                </p>
                                <p className="text-sm text-blue-600" data-oid="i:-ks1a">
                                    Assigned to: Sarah Ahmed
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="bdgqo:k">
                                <span
                                    className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                                    data-oid="2btq02:"
                                >
                                    URGENT
                                </span>
                                <span
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                    data-oid="rzq639y"
                                >
                                    IN PROGRESS
                                </span>
                                <span
                                    className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                                    data-oid="sbjpk2r"
                                >
                                    PRESCRIPTION
                                </span>
                            </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 mb-4" data-oid="3ro_0ko">
                            <h5 className="font-medium text-red-800 mb-1" data-oid="8s4uh8s">
                                Customer Message:
                            </h5>
                            <p className="text-sm text-red-700" data-oid="j4fy_5:">
                                {'"'}The prescription reader made an error in reading my prescription.
                                Wrong medicine was suggested.{'"'}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 mb-4" data-oid="h5mcd7n">
                            <h5 className="font-medium text-green-800 mb-1" data-oid="ycfqlje">
                                Agent Response:
                            </h5>
                            <p className="text-sm text-green-700" data-oid="deofq28">
                                {'"'}I understand your concern. Let me review your prescription and
                                coordinate with our prescription reading team to correct this
                                error.{'"'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2" data-oid="vyuty40">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-oid="qy8_a25"
                            >
                                📧 Follow Up
                            </button>
                            <button
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                data-oid="nzpl23u"
                            >
                                🔺 Escalate
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                data-oid="ynn9.2q"
                            >
                                ✅ Resolve
                            </button>
                        </div>
                    </div>

                    {/* Ticket 3 */}
                    <div className="border border-gray-200 rounded-xl p-4" data-oid="zl_03hg">
                        <div className="flex items-start justify-between mb-4" data-oid=".4keze9">
                            <div data-oid="0aqdw0d">
                                <h4 className="font-semibold text-gray-900" data-oid="wpn:jyx">
                                    CS-2024-003
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="q.rfqpb">
                                    Customer: Omar Mohamed • Phone: +20 102 345 6789
                                </p>
                                <p className="text-sm text-gray-600" data-oid="25yd0ly">
                                    Subject: Payment not processed
                                </p>
                                <p className="text-sm text-blue-600" data-oid="own-6tf">
                                    Assigned to: Mohamed Hassan
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="myv2..n">
                                <span
                                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                                    data-oid="ugswaw0"
                                >
                                    NORMAL
                                </span>
                                <span
                                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                    data-oid="qksa-2k"
                                >
                                    WAITING CUSTOMER
                                </span>
                                <span
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                                    data-oid="c1zs15v"
                                >
                                    PAYMENT
                                </span>
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 mb-4" data-oid="eq1zl.t">
                            <h5 className="font-medium text-yellow-800 mb-1" data-oid="k16dy.m">
                                Customer Message:
                            </h5>
                            <p className="text-sm text-yellow-700" data-oid="1nh_puc">
                                {'"'}I made a payment but it shows as pending in my account.{'"'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2" data-oid="jdg852x">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                data-oid="4ktd0kq"
                            >
                                💳 Check Payment
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                data-oid="3xlkud_"
                            >
                                📞 Call Customer
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                data-oid="nwkcqt2"
                            >
                                🔄 Process Refund
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
