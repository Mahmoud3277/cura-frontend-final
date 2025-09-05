'use client';

import { useState } from 'react';
import { Allergy } from '@/lib/types';
import { healthProfileService } from '@/lib/services/healthProfileService';

interface AllergiesTabProps {
    allergies: Allergy[];
    customerId: string;
    onUpdate: () => void;
}

export function AllergiesTab({ allergies, customerId, onUpdate }: AllergiesTabProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
    const [formData, setFormData] = useState({
        allergen: '',
        type: 'drug' as const,
        severity: 'mild' as const,
        symptoms: [] as string[],
        firstOccurrence: '',
        lastOccurrence: '',
        treatment: '',
        notes: '',
    });

    const handleAddAllergy = () => {
        const newAllergy = {
            ...formData,
            firstOccurrence: formData.firstOccurrence
                ? new Date(formData.firstOccurrence)
                : undefined,
            lastOccurrence: formData.lastOccurrence ? new Date(formData.lastOccurrence) : undefined,
        };

        healthProfileService.addAllergy(customerId, newAllergy);
        setShowAddForm(false);
        resetForm();
        onUpdate();
    };

    const handleDeleteAllergy = (allergyId: string) => {
        if (confirm('Are you sure you want to delete this allergy?')) {
            healthProfileService.deleteAllergy(customerId, allergyId);
            onUpdate();
        }
    };

    const resetForm = () => {
        setFormData({
            allergen: '',
            type: 'drug',
            severity: 'mild',
            symptoms: [],
            firstOccurrence: '',
            lastOccurrence: '',
            treatment: '',
            notes: '',
        });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'life-threatening':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'severe':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'mild':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'drug':
                return '💊';
            case 'food':
                return '🍎';
            case 'environmental':
                return '🌿';
            default:
                return '⚠️';
        }
    };

    return (
        <div className="p-6" data-oid="t2sdkwo">
            <div className="flex items-center justify-between mb-6" data-oid=":3ietnj">
                <h3 className="text-lg font-semibold" data-oid="yi.gq_z">
                    Allergies & Adverse Reactions
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                    data-oid="w1xdj-a"
                >
                    Add Allergy
                </button>
            </div>

            {allergies.length === 0 ? (
                <div className="text-center py-12" data-oid="xh_2gng">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="a_v41zx"
                    >
                        <span className="text-2xl" data-oid="ip35qwg">
                            ⚠️
                        </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2" data-oid="m8u9xg:">
                        No Allergies Recorded
                    </h4>
                    <p className="text-gray-600 mb-4" data-oid="12.x_95">
                        Add any known allergies or adverse reactions to help healthcare providers
                        make informed decisions.
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                        data-oid="v:r0p5p"
                    >
                        Add First Allergy
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="q344jjf">
                    {allergies.map((allergy) => (
                        <div
                            key={allergy.id}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="_.cyhad"
                        >
                            <div
                                className="flex items-start justify-between mb-3"
                                data-oid="qrokgip"
                            >
                                <div className="flex items-center" data-oid="f_e4mdp">
                                    <span className="text-2xl mr-2" data-oid="mtdgvtr">
                                        {getTypeIcon(allergy.type)}
                                    </span>
                                    <div data-oid="w8zpxzo">
                                        <h4
                                            className="font-medium text-gray-900"
                                            data-oid="_jrk6zb"
                                        >
                                            {allergy.allergen}
                                        </h4>
                                        <p
                                            className="text-sm text-gray-600 capitalize"
                                            data-oid="bm-3rfw"
                                        >
                                            {allergy.type} allergy
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2" data-oid="e75apog">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(allergy.severity)}`}
                                        data-oid="uxgqlot"
                                    >
                                        {allergy.severity}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteAllergy(allergy.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                        data-oid="i5gcx.y"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {allergy.symptoms.length > 0 && (
                                <div className="mb-3" data-oid="4zs:qqk">
                                    <p
                                        className="text-sm font-medium text-gray-700 mb-1"
                                        data-oid="4bseci9"
                                    >
                                        Symptoms:
                                    </p>
                                    <div className="flex flex-wrap gap-1" data-oid="_jgdnw_">
                                        {allergy.symptoms.map((symptom, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                                data-oid="hkal6n8"
                                            >
                                                {symptom}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {allergy.treatment && (
                                <div className="mb-3" data-oid="2c2a.hq">
                                    <p
                                        className="text-sm font-medium text-gray-700 mb-1"
                                        data-oid="njwkejn"
                                    >
                                        Treatment:
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="r5-:y8q">
                                        {allergy.treatment}
                                    </p>
                                </div>
                            )}

                            {allergy.firstOccurrence && (
                                <div className="text-xs text-gray-500" data-oid=":if2aub">
                                    First occurred:{' '}
                                    {new Date(allergy.firstOccurrence).toLocaleDateString()}
                                </div>
                            )}

                            {allergy.notes && (
                                <div
                                    className="mt-2 text-sm text-gray-600 italic"
                                    data-oid="q9g5nel"
                                >
                                    {allergy.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Allergy Modal */}
            {showAddForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="dx.m99i"
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                        data-oid="wa9h70e"
                    >
                        <h3 className="text-lg font-semibold mb-4" data-oid="4da44ae">
                            Add New Allergy
                        </h3>

                        <div className="space-y-4" data-oid="98vo4x-">
                            <div data-oid="8bwmkbn">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="k8pyw.q"
                                >
                                    Allergen *
                                </label>
                                <input
                                    type="text"
                                    value={formData.allergen}
                                    onChange={(e) =>
                                        setFormData({ ...formData, allergen: e.target.value })
                                    }
                                    placeholder="e.g., Penicillin, Peanuts, Pollen"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="dgfr6ib"
                                />
                            </div>

                            <div data-oid="cve35pi">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="41xk778"
                                >
                                    Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value as any })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="fp8g_nt"
                                >
                                    <option value="drug" data-oid="scvv9h5">
                                        Drug/Medication
                                    </option>
                                    <option value="food" data-oid="l4gvvbi">
                                        Food
                                    </option>
                                    <option value="environmental" data-oid="zuf5y3v">
                                        Environmental
                                    </option>
                                    <option value="other" data-oid="4lo_x_:">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div data-oid="hnwkeky">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="g4h1l-x"
                                >
                                    Severity *
                                </label>
                                <select
                                    value={formData.severity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            severity: e.target.value as any,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="5zeiacp"
                                >
                                    <option value="mild" data-oid="59v8cac">
                                        Mild
                                    </option>
                                    <option value="moderate" data-oid="z6.t4pr">
                                        Moderate
                                    </option>
                                    <option value="severe" data-oid="xhn3zg3">
                                        Severe
                                    </option>
                                    <option value="life-threatening" data-oid="pxcwo-w">
                                        Life-threatening
                                    </option>
                                </select>
                            </div>

                            <div data-oid="vym3il7">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="rbhq3cb"
                                >
                                    Symptoms (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.symptoms.join(', ')}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            symptoms: e.target.value
                                                .split(',')
                                                .map((s) => s.trim())
                                                .filter((s) => s),
                                        })
                                    }
                                    placeholder="e.g., Rash, Swelling, Difficulty breathing"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="8p1t:1m"
                                />
                            </div>

                            <div data-oid="y0eqjz6">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="2azde3z"
                                >
                                    Treatment
                                </label>
                                <input
                                    type="text"
                                    value={formData.treatment}
                                    onChange={(e) =>
                                        setFormData({ ...formData, treatment: e.target.value })
                                    }
                                    placeholder="e.g., Epinephrine, Antihistamines"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="n5zk9-n"
                                />
                            </div>

                            <div data-oid="t_z8q6n">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="uvryqg0"
                                >
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    placeholder="Additional notes or instructions"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="mt:ruw5"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6" data-oid="e.6hg19">
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                data-oid="yb1vp-j"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAllergy}
                                disabled={!formData.allergen}
                                className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50"
                                data-oid="tp.-sus"
                            >
                                Add Allergy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
