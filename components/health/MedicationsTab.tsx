'use client';

import { CurrentMedication } from '@/lib/types';

interface MedicationsTabProps {
    medications: CurrentMedication[];
    customerId: string;
    onUpdate: () => void;
}

export function MedicationsTab({ medications, customerId, onUpdate }: MedicationsTabProps) {
    return (
        <div className="p-6" data-oid="8vkbib0">
            <div className="flex items-center justify-between mb-6" data-oid="zpvkvgh">
                <h3 className="text-lg font-semibold" data-oid="xzlcm-u">
                    Current Medications
                </h3>
                <button
                    className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                    data-oid="0o4r7.p"
                >
                    Add Medication
                </button>
            </div>

            {medications.length === 0 ? (
                <div className="text-center py-12" data-oid="2spz-ac">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="vivdgza"
                    >
                        <span className="text-2xl" data-oid=":qg9on:">
                            💊
                        </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2" data-oid="bwaa95n">
                        No Current Medications
                    </h4>
                    <p className="text-gray-600" data-oid="lg8s363">
                        Add your current medications to track adherence and check for interactions.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="wur.3vx">
                    {medications.map((medication) => (
                        <div
                            key={medication.id}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="8o2q0gr"
                        >
                            <div
                                className="flex items-start justify-between mb-3"
                                data-oid="lqzhtu3"
                            >
                                <div data-oid="kumi8wj">
                                    <h4 className="font-medium text-gray-900" data-oid="fm8x-_g">
                                        {medication.medicationName}
                                    </h4>
                                    <p className="text-sm text-gray-600" data-oid="cp7j_o.">
                                        {medication.dosage} - {medication.frequency}
                                    </p>
                                </div>
                                {medication.adherence && (
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            medication.adherence >= 90
                                                ? 'bg-green-100 text-green-800'
                                                : medication.adherence >= 80
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                        }`}
                                        data-oid="o.vb__:"
                                    >
                                        {medication.adherence}% adherence
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm" data-oid="g.27.6h">
                                <div className="flex justify-between" data-oid="idp5k5r">
                                    <span className="text-gray-600" data-oid="oaqbh5z">
                                        Indication:
                                    </span>
                                    <span data-oid="g0xr.-l">{medication.indication}</span>
                                </div>
                                <div className="flex justify-between" data-oid="d.-fupg">
                                    <span className="text-gray-600" data-oid="t:vxfog">
                                        Prescribed by:
                                    </span>
                                    <span data-oid="t0x5ap7">{medication.prescribedBy}</span>
                                </div>
                                <div className="flex justify-between" data-oid="eole.np">
                                    <span className="text-gray-600" data-oid="saqj396">
                                        Started:
                                    </span>
                                    <span data-oid="vto_ai5">
                                        {new Date(medication.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid="uskv2x:">
                                    <span className="text-gray-600" data-oid="l1dznxo">
                                        Route:
                                    </span>
                                    <span className="capitalize" data-oid="o3hiwo:">
                                        {medication.route}
                                    </span>
                                </div>
                            </div>

                            {medication.notes && (
                                <div
                                    className="mt-3 text-sm text-gray-600 italic"
                                    data-oid="h:-6ee6"
                                >
                                    {medication.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
