'use client';

import { useState } from 'react';
import { PersonalHealthInfo } from '@/lib/types';
import { healthProfileService } from '@/lib/services/healthProfileService';

interface PersonalInfoTabProps {
    personalInfo: PersonalHealthInfo;
    customerId: string;
    onUpdate: () => void;
}

export function PersonalInfoTab({ personalInfo, customerId, onUpdate }: PersonalInfoTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(personalInfo);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const success = healthProfileService.updatePersonalInfo(customerId, formData);
            if (success) {
                setIsEditing(false);
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating personal info:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(personalInfo);
        setIsEditing(false);
    };

    const calculateAge = (dateOfBirth: Date) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const calculateBMI = (height: number, weight: number) => {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
        if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
        if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
        return { category: 'Obese', color: 'text-red-600' };
    };

    const bmi = parseFloat(calculateBMI(formData.height, formData.weight));
    const bmiInfo = getBMICategory(bmi);

    return (
        <div className="p-6" data-oid="ecxf2ij">
            <div className="flex items-center justify-between mb-6" data-oid="uyc-i6f">
                <h3 className="text-lg font-semibold" data-oid="_-dtakf">
                    Personal Health Information
                </h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                        data-oid="qijz.of"
                    >
                        Edit Information
                    </button>
                ) : (
                    <div className="space-x-2" data-oid="153t-cn">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            data-oid=":4--mp8"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50"
                            data-oid="72g:20a"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="99r5-69">
                    {/* Basic Information */}
                    <div className="space-y-6" data-oid="i:3zdrn">
                        <div data-oid="avke4ap">
                            <h4 className="font-medium text-gray-900 mb-4" data-oid="esf255n">
                                Basic Information
                            </h4>
                            <div className="space-y-3" data-oid="x5vdczk">
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="rurdryh"
                                >
                                    <span className="text-gray-600" data-oid="51yjsg6">
                                        Date of Birth:
                                    </span>
                                    <span className="font-medium" data-oid="r52bd7x">
                                        {new Date(personalInfo.dateOfBirth).toLocaleDateString()}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="js0:li:"
                                >
                                    <span className="text-gray-600" data-oid=":_st8el">
                                        Age:
                                    </span>
                                    <span className="font-medium" data-oid="caciy75">
                                        {calculateAge(personalInfo.dateOfBirth)} years
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid=".eelq-y"
                                >
                                    <span className="text-gray-600" data-oid=":g3ggwo">
                                        Gender:
                                    </span>
                                    <span className="font-medium capitalize" data-oid="1p.9ddf">
                                        {personalInfo.gender}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="4s9-mk:"
                                >
                                    <span className="text-gray-600" data-oid="6_vl2-:">
                                        Blood Type:
                                    </span>
                                    <span className="font-medium" data-oid="egasnhr">
                                        {personalInfo.bloodType}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="_c1cyt:"
                                >
                                    <span className="text-gray-600" data-oid="f.q.88d">
                                        Marital Status:
                                    </span>
                                    <span className="font-medium capitalize" data-oid="h:vtdi4">
                                        {personalInfo.maritalStatus || 'Not specified'}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="i8ubtv:"
                                >
                                    <span className="text-gray-600" data-oid="92sevr5">
                                        Occupation:
                                    </span>
                                    <span className="font-medium" data-oid="p.-nbjp">
                                        {personalInfo.occupation || 'Not specified'}
                                    </span>
                                </div>
                                {personalInfo.whatsappNumber && (
                                    <div
                                        className="flex justify-between py-2 border-b border-gray-100"
                                        data-oid="whatsapp-display-health"
                                    >
                                        <span
                                            className="text-gray-600"
                                            data-oid="whatsapp-label-health"
                                        >
                                            WhatsApp Number:
                                        </span>
                                        <span
                                            className="font-medium flex items-center"
                                            data-oid="whatsapp-value-health"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2 text-green-600"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="whatsapp-icon-health"
                                            >
                                                <path
                                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"
                                                    data-oid="0:ppsh:"
                                                />
                                            </svg>
                                            {personalInfo.whatsappNumber}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Physical & Lifestyle */}
                    <div className="space-y-6" data-oid="5ovpu2r">
                        <div data-oid="dv5swq2">
                            <h4 className="font-medium text-gray-900 mb-4" data-oid="49ox78v">
                                Physical & Lifestyle
                            </h4>
                            <div className="space-y-3" data-oid="ff0t010">
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="vv1a-t-"
                                >
                                    <span className="text-gray-600" data-oid="gcwoh:i">
                                        Height:
                                    </span>
                                    <span className="font-medium" data-oid="rzreyiz">
                                        {personalInfo.height} cm
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="cket6au"
                                >
                                    <span className="text-gray-600" data-oid="t7h235x">
                                        Weight:
                                    </span>
                                    <span className="font-medium" data-oid="10k0ny0">
                                        {personalInfo.weight} kg
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid=":4vygh1"
                                >
                                    <span className="text-gray-600" data-oid="3eeht_2">
                                        BMI:
                                    </span>
                                    <span
                                        className={`font-medium ${bmiInfo.color}`}
                                        data-oid="pg:s26l"
                                    >
                                        {bmi} ({bmiInfo.category})
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="xbwtijm"
                                >
                                    <span className="text-gray-600" data-oid="66l:mc1">
                                        Smoking Status:
                                    </span>
                                    <span className="font-medium capitalize" data-oid="ih4irbh">
                                        {personalInfo.smokingStatus}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="esudemq"
                                >
                                    <span className="text-gray-600" data-oid="ooc8yv5">
                                        Alcohol Consumption:
                                    </span>
                                    <span className="font-medium capitalize" data-oid="zjp:a15">
                                        {personalInfo.alcoholConsumption}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-100"
                                    data-oid="uxvcz24"
                                >
                                    <span className="text-gray-600" data-oid="4pil_x7">
                                        Exercise Frequency:
                                    </span>
                                    <span className="font-medium capitalize" data-oid="n80miyr">
                                        {personalInfo.exerciseFrequency}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="xqebk-i">
                    {/* Basic Information Form */}
                    <div className="space-y-6" data-oid="75yhffa">
                        <div data-oid="5zil3:6">
                            <h4 className="font-medium text-gray-900 mb-4" data-oid=".8w3hs6">
                                Basic Information
                            </h4>
                            <div className="space-y-4" data-oid=".ma3e_:">
                                <div data-oid="eri70vp">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="jj24-ja"
                                    >
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            new Date(formData.dateOfBirth)
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                dateOfBirth: new Date(e.target.value),
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="8g6_33-"
                                    />
                                </div>
                                <div data-oid="2g:ewlu">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="n1e-e8j"
                                    >
                                        Gender
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                gender: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="9aw264e"
                                    >
                                        <option value="male" data-oid="5bv_s.2">
                                            Male
                                        </option>
                                        <option value="female" data-oid="4urqtoc">
                                            Female
                                        </option>
                                        <option value="other" data-oid="jly-upo">
                                            Other
                                        </option>
                                        <option value="prefer-not-to-say" data-oid="1jw2e9w">
                                            Prefer not to say
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="q-akqan">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="rt9n7vg"
                                    >
                                        Blood Type
                                    </label>
                                    <select
                                        value={formData.bloodType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                bloodType: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="u5lscin"
                                    >
                                        <option value="A+" data-oid="dq:jpy3">
                                            A+
                                        </option>
                                        <option value="A-" data-oid="g664wss">
                                            A-
                                        </option>
                                        <option value="B+" data-oid="pxyn0c4">
                                            B+
                                        </option>
                                        <option value="B-" data-oid="ffx9q8f">
                                            B-
                                        </option>
                                        <option value="AB+" data-oid="p4gdfqf">
                                            AB+
                                        </option>
                                        <option value="AB-" data-oid="nggj1kt">
                                            AB-
                                        </option>
                                        <option value="O+" data-oid="p-k2wt6">
                                            O+
                                        </option>
                                        <option value="O-" data-oid="0.451u:">
                                            O-
                                        </option>
                                        <option value="unknown" data-oid="svr3.bo">
                                            Unknown
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="cfwx857">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="1qk0swi"
                                    >
                                        Marital Status
                                    </label>
                                    <select
                                        value={formData.maritalStatus || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                maritalStatus: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid=":b.n842"
                                    >
                                        <option value="" data-oid="2ewrtwy">
                                            Select status
                                        </option>
                                        <option value="single" data-oid=":7ztm0q">
                                            Single
                                        </option>
                                        <option value="married" data-oid="4a_li.t">
                                            Married
                                        </option>
                                        <option value="divorced" data-oid="3427o0t">
                                            Divorced
                                        </option>
                                        <option value="widowed" data-oid="6diteqc">
                                            Widowed
                                        </option>
                                        <option value="other" data-oid="emegeh:">
                                            Other
                                        </option>
                                    </select>
                                </div>
                                <div data-oid=".et_ek3">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="5463rpb"
                                    >
                                        Occupation
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.occupation || ''}
                                        onChange={(e) =>
                                            setFormData({ ...formData, occupation: e.target.value })
                                        }
                                        placeholder="Enter your occupation"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="eiws6of"
                                    />
                                </div>
                                <div data-oid="whatsapp-edit-health">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="whatsapp-edit-label-health"
                                    >
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.whatsappNumber || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                whatsappNumber: e.target.value,
                                            })
                                        }
                                        placeholder="+20 XXX XXX XXXX"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="whatsapp-edit-input-health"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physical & Lifestyle Form */}
                    <div className="space-y-6" data-oid="rp9_co_">
                        <div data-oid="1413o0c">
                            <h4 className="font-medium text-gray-900 mb-4" data-oid="8loq40u">
                                Physical & Lifestyle
                            </h4>
                            <div className="space-y-4" data-oid="l86akp:">
                                <div data-oid="_49v787">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="ugs6:en"
                                    >
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                height: parseInt(e.target.value),
                                            })
                                        }
                                        min="100"
                                        max="250"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="h5hjbag"
                                    />
                                </div>
                                <div data-oid="wu61sac">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="7e9gbyj"
                                    >
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                weight: parseInt(e.target.value),
                                            })
                                        }
                                        min="30"
                                        max="300"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="-06gqa:"
                                    />
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg" data-oid="2:56v3g">
                                    <p className="text-sm text-gray-600" data-oid="7r1_wae">
                                        BMI:{' '}
                                        <span
                                            className={`font-medium ${bmiInfo.color}`}
                                            data-oid="-mphymz"
                                        >
                                            {bmi} ({bmiInfo.category})
                                        </span>
                                    </p>
                                </div>
                                <div data-oid="o:575_-">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="m95pidq"
                                    >
                                        Smoking Status
                                    </label>
                                    <select
                                        value={formData.smokingStatus}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                smokingStatus: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="2zh8:q6"
                                    >
                                        <option value="never" data-oid="13jbu8l">
                                            Never
                                        </option>
                                        <option value="former" data-oid="hh2.d4u">
                                            Former smoker
                                        </option>
                                        <option value="current" data-oid="mh9sfjj">
                                            Current smoker
                                        </option>
                                        <option value="unknown" data-oid="jhxv7cs">
                                            Unknown
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="ai92568">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="b7fwb9o"
                                    >
                                        Alcohol Consumption
                                    </label>
                                    <select
                                        value={formData.alcoholConsumption}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                alcoholConsumption: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="fxkw71:"
                                    >
                                        <option value="none" data-oid="gcc3icr">
                                            None
                                        </option>
                                        <option value="occasional" data-oid="ber.y3z">
                                            Occasional
                                        </option>
                                        <option value="moderate" data-oid="a2pa:zd">
                                            Moderate
                                        </option>
                                        <option value="heavy" data-oid="4g:hp20">
                                            Heavy
                                        </option>
                                        <option value="unknown" data-oid="kry4878">
                                            Unknown
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="kvj79n8">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="_77bd3p"
                                    >
                                        Exercise Frequency
                                    </label>
                                    <select
                                        value={formData.exerciseFrequency}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                exerciseFrequency: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="3zy2g36"
                                    >
                                        <option value="none" data-oid="coiz_2e">
                                            None
                                        </option>
                                        <option value="rarely" data-oid="h.2ds5l">
                                            Rarely
                                        </option>
                                        <option value="weekly" data-oid="114u8nk">
                                            Weekly
                                        </option>
                                        <option value="daily" data-oid="g_wntjw">
                                            Daily
                                        </option>
                                        <option value="unknown" data-oid="0r3i3a0">
                                            Unknown
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
