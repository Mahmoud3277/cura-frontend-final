'use client';

import { MedicalHistory } from '@/lib/types';

interface MedicalHistoryTabProps {
    medicalHistory: MedicalHistory;
    customerId: string;
    onUpdate: () => void;
}

export function MedicalHistoryTab({
    medicalHistory,
    customerId,
    onUpdate,
}: MedicalHistoryTabProps) {
    return (
        <div className="p-6" data-oid="rjjedmp">
            <h3 className="text-lg font-semibold mb-6" data-oid="o6iy04n">
                Medical History
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="zygf0sr">
                {/* Surgeries */}
                <div data-oid=".jg8zk4">
                    <h4 className="font-medium text-gray-900 mb-4" data-oid="s_bkhff">
                        Surgeries
                    </h4>
                    {medicalHistory.surgeries.length === 0 ? (
                        <p className="text-gray-600 text-sm" data-oid="fljknst">
                            No surgeries recorded
                        </p>
                    ) : (
                        <div className="space-y-3" data-oid="8roi-a.">
                            {medicalHistory.surgeries.map((surgery) => (
                                <div
                                    key={surgery.id}
                                    className="border border-gray-200 rounded-lg p-3"
                                    data-oid="0-.hhbj"
                                >
                                    <h5 className="font-medium" data-oid="49amz0p">
                                        {surgery.procedure}
                                    </h5>
                                    <p className="text-sm text-gray-600" data-oid="lbmgvsv">
                                        {new Date(surgery.date).toLocaleDateString()} at{' '}
                                        {surgery.hospital}
                                    </p>
                                    {surgery.surgeon && (
                                        <p className="text-sm text-gray-600" data-oid="6fiie30">
                                            Surgeon: {surgery.surgeon}
                                        </p>
                                    )}
                                    {surgery.notes && (
                                        <p
                                            className="text-sm text-gray-500 mt-1"
                                            data-oid="bflzxig"
                                        >
                                            {surgery.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Family History */}
                <div data-oid="fj7r89_">
                    <h4 className="font-medium text-gray-900 mb-4" data-oid="5wvocwg">
                        Family History
                    </h4>
                    {medicalHistory.familyHistory.length === 0 ? (
                        <p className="text-gray-600 text-sm" data-oid="-kq9f.p">
                            No family history recorded
                        </p>
                    ) : (
                        <div className="space-y-3" data-oid="zm56cw-">
                            {medicalHistory.familyHistory.map((history) => (
                                <div
                                    key={history.id}
                                    className="border border-gray-200 rounded-lg p-3"
                                    data-oid="3qza9et"
                                >
                                    <h5 className="font-medium" data-oid="thk4d74">
                                        {history.condition}
                                    </h5>
                                    <p
                                        className="text-sm text-gray-600 capitalize"
                                        data-oid="zn_i6w_"
                                    >
                                        {history.relation}
                                        {history.ageOfOnset &&
                                            ` - Age of onset: ${history.ageOfOnset}`}
                                    </p>
                                    {history.notes && (
                                        <p
                                            className="text-sm text-gray-500 mt-1"
                                            data-oid="opd2yrv"
                                        >
                                            {history.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vaccinations */}
                <div data-oid="di9q:oi">
                    <h4 className="font-medium text-gray-900 mb-4" data-oid="t6r5::m">
                        Vaccinations
                    </h4>
                    {medicalHistory.vaccinations.length === 0 ? (
                        <p className="text-gray-600 text-sm" data-oid="aezy552">
                            No vaccinations recorded
                        </p>
                    ) : (
                        <div className="space-y-3" data-oid="lphz.40">
                            {medicalHistory.vaccinations.map((vaccination) => (
                                <div
                                    key={vaccination.id}
                                    className="border border-gray-200 rounded-lg p-3"
                                    data-oid="0pn_4fo"
                                >
                                    <h5 className="font-medium" data-oid="-9de4n1">
                                        {vaccination.vaccine}
                                    </h5>
                                    <p className="text-sm text-gray-600" data-oid="k7en-27">
                                        {new Date(vaccination.date).toLocaleDateString()} -{' '}
                                        {vaccination.provider}
                                    </p>
                                    {vaccination.nextDue && (
                                        <p className="text-sm text-blue-600" data-oid="2.5m8i0">
                                            Next due:{' '}
                                            {new Date(vaccination.nextDue).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lab Results */}
                <div data-oid="dny2:gb">
                    <h4 className="font-medium text-gray-900 mb-4" data-oid="50subh1">
                        Recent Lab Results
                    </h4>
                    {medicalHistory.labResults.length === 0 ? (
                        <p className="text-gray-600 text-sm" data-oid=".34f49f">
                            No lab results recorded
                        </p>
                    ) : (
                        <div className="space-y-3" data-oid="c:y4ffv">
                            {medicalHistory.labResults.slice(0, 5).map((result) => (
                                <div
                                    key={result.id}
                                    className="border border-gray-200 rounded-lg p-3"
                                    data-oid="10jc95:"
                                >
                                    <div
                                        className="flex justify-between items-start"
                                        data-oid="di9010:"
                                    >
                                        <div data-oid="nlq_e_a">
                                            <h5 className="font-medium" data-oid="vw244t.">
                                                {result.testName}
                                            </h5>
                                            <p className="text-sm text-gray-600" data-oid="2hxtki8">
                                                {result.value} {result.unit}
                                            </p>
                                            <p className="text-xs text-gray-500" data-oid="rf-rlvk">
                                                Reference: {result.referenceRange}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                result.status === 'normal'
                                                    ? 'bg-green-100 text-green-800'
                                                    : result.status === 'abnormal'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : 'bg-red-100 text-red-800'
                                            }`}
                                            data-oid="fwk6ukt"
                                        >
                                            {result.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1" data-oid="9oqvziy">
                                        {new Date(result.date).toLocaleDateString()} -{' '}
                                        {result.provider}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
