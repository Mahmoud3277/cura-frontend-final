'use client';

import { ChronicCondition } from '@/lib/types';

interface ChronicConditionsTabProps {
    conditions: ChronicCondition[];
    customerId: string;
    onUpdate: () => void;
}

export function ChronicConditionsTab({
    conditions,
    customerId,
    onUpdate,
}: ChronicConditionsTabProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'controlled':
                return 'bg-green-100 text-green-800';
            case 'active':
                return 'bg-yellow-100 text-yellow-800';
            case 'remission':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6" data-oid="bznksne">
            <div className="flex items-center justify-between mb-6" data-oid="1fxega.">
                <h3 className="text-lg font-semibold" data-oid="1re-.kt">
                    Chronic Conditions
                </h3>
                <button
                    className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                    data-oid="vj281y2"
                >
                    Add Condition
                </button>
            </div>

            {conditions.length === 0 ? (
                <div className="text-center py-12" data-oid="e2:j2l:">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="2cogmpq"
                    >
                        <span className="text-2xl" data-oid="z-2dtb8">
                            🏥
                        </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2" data-oid="pbyba7n">
                        No Chronic Conditions
                    </h4>
                    <p className="text-gray-600" data-oid="5k4pttb">
                        Track any ongoing health conditions for better care management.
                    </p>
                </div>
            ) : (
                <div className="space-y-4" data-oid=".s9:i42">
                    {conditions.map((condition) => (
                        <div
                            key={condition.id}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="_a-cav_"
                        >
                            <div
                                className="flex items-start justify-between mb-3"
                                data-oid="6r1zssu"
                            >
                                <div data-oid="6gccw2g">
                                    <h4 className="font-medium text-gray-900" data-oid="99mp605">
                                        {condition.condition}
                                    </h4>
                                    <p className="text-sm text-gray-600" data-oid="etp1kf8">
                                        Diagnosed:{' '}
                                        {new Date(condition.diagnosisDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(condition.status)}`}
                                    data-oid=":t4pi1a"
                                >
                                    {condition.status}
                                </span>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                                data-oid="8swgp38"
                            >
                                <div data-oid="vjry3-w">
                                    <span className="text-gray-600" data-oid="nw.vkud">
                                        Diagnosed by:
                                    </span>
                                    <span className="ml-2" data-oid="7ok5788">
                                        {condition.diagnosedBy}
                                    </span>
                                </div>
                                <div data-oid="os2705.">
                                    <span className="text-gray-600" data-oid="6hwatby">
                                        Severity:
                                    </span>
                                    <span className="ml-2 capitalize" data-oid="lgygfez">
                                        {condition.severity}
                                    </span>
                                </div>
                                {condition.lastCheckup && (
                                    <div data-oid="fho47q_">
                                        <span className="text-gray-600" data-oid="20z75nx">
                                            Last checkup:
                                        </span>
                                        <span className="ml-2" data-oid="bztipml">
                                            {new Date(condition.lastCheckup).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                {condition.nextCheckup && (
                                    <div data-oid="0yv.vjm">
                                        <span className="text-gray-600" data-oid="k7:_he2">
                                            Next checkup:
                                        </span>
                                        <span className="ml-2" data-oid="nm4buan">
                                            {new Date(condition.nextCheckup).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {condition.medications.length > 0 && (
                                <div className="mt-3" data-oid="r::n-oe">
                                    <span className="text-sm text-gray-600" data-oid="8xybgw4">
                                        Medications:
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1" data-oid="oldmv78">
                                        {condition.medications.map((med, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                                data-oid="z:42hq1"
                                            >
                                                {med}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {condition.notes && (
                                <div
                                    className="mt-3 text-sm text-gray-600 italic"
                                    data-oid="_6to92t"
                                >
                                    {condition.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
