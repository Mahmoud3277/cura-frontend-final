'use client';

import { EmergencyContact } from '@/lib/types';

interface EmergencyContactsTabProps {
    contacts: EmergencyContact[];
    customerId: string;
    onUpdate: () => void;
}

export function EmergencyContactsTab({
    contacts,
    customerId,
    onUpdate,
}: EmergencyContactsTabProps) {
    return (
        <div className="p-6" data-oid=".pw-qu6">
            <div className="flex items-center justify-between mb-6" data-oid="ml76atw">
                <h3 className="text-lg font-semibold" data-oid="aruqrxl">
                    Emergency Contacts
                </h3>
                <button
                    className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                    data-oid="pjoymre"
                >
                    Add Contact
                </button>
            </div>

            {contacts.length === 0 ? (
                <div className="text-center py-12" data-oid="lwwzwxu">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="lgl763_"
                    >
                        <span className="text-2xl" data-oid="1585wtx">
                            🚨
                        </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2" data-oid="87mnuba">
                        No Emergency Contacts
                    </h4>
                    <p className="text-gray-600" data-oid="lxg9.md">
                        Add emergency contacts for healthcare providers to reach in case of
                        emergency.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="wd5xy.p">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="wb0q_ti"
                        >
                            <div
                                className="flex items-start justify-between mb-3"
                                data-oid="5dy1l90"
                            >
                                <div data-oid="afy7tl-">
                                    <h4 className="font-medium text-gray-900" data-oid="a:wpuvr">
                                        {contact.name}
                                    </h4>
                                    <p className="text-sm text-gray-600" data-oid="w.sgbzi">
                                        {contact.relationship}
                                    </p>
                                </div>
                                {contact.isPrimary && (
                                    <span
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                                        data-oid="0lhmusr"
                                    >
                                        Primary
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm" data-oid="4zrprmb">
                                <div className="flex items-center" data-oid="-y5rdso">
                                    <span className="text-gray-600 w-16" data-oid="cqs4t_p">
                                        Phone:
                                    </span>
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="text-blue-600 hover:underline"
                                        data-oid="2p2irx6"
                                    >
                                        {contact.phone}
                                    </a>
                                </div>
                                {contact.email && (
                                    <div className="flex items-center" data-oid="akbv--1">
                                        <span className="text-gray-600 w-16" data-oid="jol.we3">
                                            Email:
                                        </span>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-blue-600 hover:underline"
                                            data-oid="8lul43h"
                                        >
                                            {contact.email}
                                        </a>
                                    </div>
                                )}
                                {contact.address && (
                                    <div className="flex items-start" data-oid="x.8t2qr">
                                        <span className="text-gray-600 w-16" data-oid="yy9u4t8">
                                            Address:
                                        </span>
                                        <span className="text-gray-700" data-oid="k8ud560">
                                            {contact.address}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
