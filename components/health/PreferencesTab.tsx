'use client';

import { useState } from 'react';
import { HealthPreferences } from '@/lib/types';

interface PreferencesTabProps {
    preferences: HealthPreferences;
    customerId: string;
    onUpdate: () => void;
}

export function PreferencesTab({ preferences, customerId, onUpdate }: PreferencesTabProps) {
    const [formData, setFormData] = useState(preferences);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Mock save - in real implementation, this would call the service
        setTimeout(() => {
            setSaving(false);
            onUpdate();
        }, 1000);
    };

    return (
        <div className="p-6 space-y-8" data-oid="xe:js:a">
            <div className="flex items-center justify-between" data-oid="c-zwuhd">
                <h3 className="text-lg font-semibold" data-oid="q11:j2d">
                    Health Profile Preferences
                </h3>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50"
                    data-oid="gct7nhf"
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>

            {/* Reminder Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6" data-oid="ja9jb72">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="mtij4vp">
                    Reminder Settings
                </h4>
                <div className="space-y-4" data-oid="pm.0b98">
                    <div className="flex items-center justify-between" data-oid="cp.xxoo">
                        <div data-oid="df_qo5s">
                            <label className="font-medium text-gray-700" data-oid="8z.wy4h">
                                Medication Reminders
                            </label>
                            <p className="text-sm text-gray-600" data-oid="km3p5km">
                                Get notified when it{"'"}s time to take your medications
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.reminderSettings.medicationReminders}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    reminderSettings: {
                                        ...formData.reminderSettings,
                                        medicationReminders: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="5m6e5k4"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="y_sgk1t">
                        <div data-oid="gf53mzy">
                            <label className="font-medium text-gray-700" data-oid="w8mgvr3">
                                Appointment Reminders
                            </label>
                            <p className="text-sm text-gray-600" data-oid="b1qksph">
                                Get reminded about upcoming medical appointments
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.reminderSettings.appointmentReminders}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    reminderSettings: {
                                        ...formData.reminderSettings,
                                        appointmentReminders: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="2k3nnh:"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="d738qo8">
                        <div data-oid="iu1.da1">
                            <label className="font-medium text-gray-700" data-oid=".emdhb5">
                                Health Tips
                            </label>
                            <p className="text-sm text-gray-600" data-oid="_0wz6xv">
                                Receive personalized health tips and recommendations
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.reminderSettings.healthTips}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    reminderSettings: {
                                        ...formData.reminderSettings,
                                        healthTips: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="-sg_021"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="uuy5jx:">
                        <div data-oid=":nq3itp">
                            <label className="font-medium text-gray-700" data-oid="r80:wd:">
                                Goal Reminders
                            </label>
                            <p className="text-sm text-gray-600" data-oid="hsqpcz9">
                                Get motivated with progress updates on your health goals
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.reminderSettings.goalReminders}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    reminderSettings: {
                                        ...formData.reminderSettings,
                                        goalReminders: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="dvnof.7"
                        />
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6" data-oid="pum88ru">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="hs72ttt">
                    Privacy Settings
                </h4>
                <div className="space-y-4" data-oid="kg93nme">
                    <div className="flex items-center justify-between" data-oid="8.iz3g2">
                        <div data-oid="55ua4q4">
                            <label className="font-medium text-gray-700" data-oid="_blyaa:">
                                Share with Doctors
                            </label>
                            <p className="text-sm text-gray-600" data-oid="76mevwe">
                                Allow healthcare providers to access your health profile
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.privacySettings.shareWithDoctors}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    privacySettings: {
                                        ...formData.privacySettings,
                                        shareWithDoctors: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="rlvvr3n"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="kraw4q:">
                        <div data-oid="dd4_8hp">
                            <label className="font-medium text-gray-700" data-oid="2m6jq.r">
                                Share with Pharmacies
                            </label>
                            <p className="text-sm text-gray-600" data-oid="5-3a4k1">
                                Allow pharmacies to access relevant health information
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.privacySettings.shareWithPharmacies}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    privacySettings: {
                                        ...formData.privacySettings,
                                        shareWithPharmacies: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="sxzrock"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="_v-z4m8">
                        <div data-oid="4x402dx">
                            <label className="font-medium text-gray-700" data-oid="0-qq54f">
                                Allow Research
                            </label>
                            <p className="text-sm text-gray-600" data-oid="njjrlm-">
                                Contribute anonymized data to medical research
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.privacySettings.allowResearch}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    privacySettings: {
                                        ...formData.privacySettings,
                                        allowResearch: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="c0_r7.5"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="e5cldx.">
                        <div data-oid="iqxceap">
                            <label className="font-medium text-gray-700" data-oid="o_lonn-">
                                Marketing Communications
                            </label>
                            <p className="text-sm text-gray-600" data-oid="9ai3_fz">
                                Receive promotional offers and health-related marketing
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.privacySettings.allowMarketing}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    privacySettings: {
                                        ...formData.privacySettings,
                                        allowMarketing: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="tlfqhy4"
                        />
                    </div>
                </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-white border border-gray-200 rounded-lg p-6" data-oid="djp0:ke">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="tk1rvhr">
                    Communication Preferences
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="y6d-lb5">
                    <div data-oid="4cq7a23">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="6z789dn"
                        >
                            Preferred Language
                        </label>
                        <select
                            value={formData.communicationPreferences.preferredLanguage}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    communicationPreferences: {
                                        ...formData.communicationPreferences,
                                        preferredLanguage: e.target.value as 'en' | 'ar',
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="l5v43vi"
                        >
                            <option value="en" data-oid="fj8nxop">
                                English
                            </option>
                            <option value="ar" data-oid="xdi-rbc">
                                Arabic
                            </option>
                        </select>
                    </div>

                    <div data-oid="--yc8th">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="r13-kpu"
                        >
                            Preferred Contact Method
                        </label>
                        <select
                            value={formData.communicationPreferences.preferredContactMethod}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    communicationPreferences: {
                                        ...formData.communicationPreferences,
                                        preferredContactMethod: e.target.value as any,
                                    },
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="6oaw8cy"
                        >
                            <option value="email" data-oid="4d-pgjo">
                                Email
                            </option>
                            <option value="sms" data-oid="l87m0pb">
                                SMS
                            </option>
                            <option value="phone" data-oid="fvd4k-r">
                                Phone
                            </option>
                            <option value="app" data-oid="h7.6ojj">
                                App Notifications
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Emergency Data Sharing */}
            <div className="bg-white border border-gray-200 rounded-lg p-6" data-oid="ikb.gvp">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="9vcw.9o">
                    Emergency Data Sharing
                </h4>
                <p className="text-sm text-gray-600 mb-4" data-oid="yz9a0-6">
                    Control who can access your health information in case of emergency
                </p>
                <div className="space-y-4" data-oid="o.58em7">
                    <div className="flex items-center justify-between" data-oid="g9tvz31">
                        <div data-oid="k:uhs8v">
                            <label className="font-medium text-gray-700" data-oid="f.luug2">
                                Emergency Services
                            </label>
                            <p className="text-sm text-gray-600" data-oid="h3v:15g">
                                Allow emergency responders to access critical health info
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.healthDataSharing.emergencyAccess}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    healthDataSharing: {
                                        ...formData.healthDataSharing,
                                        emergencyAccess: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="jx0mye4"
                        />
                    </div>

                    <div className="flex items-center justify-between" data-oid="5k6jxnl">
                        <div data-oid="7ul35r7">
                            <label className="font-medium text-gray-700" data-oid="4wlm5.r">
                                Family Access
                            </label>
                            <p className="text-sm text-gray-600" data-oid="fk89px7">
                                Allow emergency contacts to view your health information
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.healthDataSharing.familyAccess}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    healthDataSharing: {
                                        ...formData.healthDataSharing,
                                        familyAccess: e.target.checked,
                                    },
                                })
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            data-oid="p.m8gol"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
