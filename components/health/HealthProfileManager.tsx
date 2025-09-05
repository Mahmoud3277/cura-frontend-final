'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import {
    healthProfileService,
    HealthInsights,
    HealthMetrics,
} from '@/lib/services/healthProfileService';
import { HealthProfile } from '@/lib/types';
import { PersonalInfoTab } from './PersonalInfoTab';
import { MedicalHistoryTab } from './MedicalHistoryTab';
import { AllergiesTab } from './AllergiesTab';
import { MedicationsTab } from './MedicationsTab';
import { ChronicConditionsTab } from './ChronicConditionsTab';
import { EmergencyContactsTab } from './EmergencyContactsTab';
import { HealthGoalsTab } from './HealthGoalsTab';
import { HealthInsightsTab } from './HealthInsightsTab';
import { PreferencesTab } from './PreferencesTab';

interface HealthProfileManagerProps {
    customerId: string;
}

export function HealthProfileManager({ customerId }: HealthProfileManagerProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const [activeTab, setActiveTab] = useState('overview');
    const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
    const [healthInsights, setHealthInsights] = useState<HealthInsights | null>(null);
    const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealthProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    const loadHealthProfile = async () => {
        try {
            setLoading(true);
            const profile = healthProfileService.getHealthProfile(customerId);
            const insights = healthProfileService.getHealthInsights(customerId);
            const metrics = healthProfileService.getHealthMetrics(customerId);

            setHealthProfile(profile);
            setHealthInsights(insights);
            setHealthMetrics(metrics);
        } catch (error) {
            console.error('Error loading health profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Health Overview', icon: '📊' },
        { id: 'personal', label: 'Personal Info', icon: '👤' },
        { id: 'medical-history', label: 'Medical History', icon: '📋' },
        { id: 'allergies', label: 'Allergies', icon: '⚠️' },
        { id: 'medications', label: 'Current Medications', icon: '💊' },
        { id: 'conditions', label: 'Chronic Conditions', icon: '🏥' },
        { id: 'emergency', label: 'Emergency Contacts', icon: '🚨' },
        { id: 'goals', label: 'Health Goals', icon: '🎯' },
        { id: 'insights', label: 'Health Insights', icon: '🔍' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]" data-oid="lmlwqox">
                <div className="text-center" data-oid="r_rtqld">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F] mx-auto mb-4"
                        data-oid="q8ixnlq"
                    ></div>
                    <p className="text-gray-600" data-oid="4eqiwg.">
                        Loading health profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!healthProfile) {
        return (
            <div className="text-center py-12" data-oid="vk96dc7">
                <div
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid=".gp12gn"
                >
                    <span className="text-2xl" data-oid="p:udge_">
                        🏥
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="xlsoow2">
                    No Health Profile Found
                </h3>
                <p className="text-gray-600 mb-6" data-oid="-.rpw0p">
                    Create your health profile to track your medical information and get
                    personalized insights.
                </p>
                <button
                    onClick={() => setActiveTab('personal')}
                    className="bg-[#1F1F6F] text-white px-6 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                    data-oid="nuce3um"
                >
                    Create Health Profile
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="9e-f.u3">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-6 rounded-2xl"
                data-oid="l:oq-o4"
            >
                <h2 className="text-2xl font-bold mb-2" data-oid=".--88dt">
                    Health Profile
                </h2>
                <p className="opacity-90" data-oid="2769vba">
                    Manage your health information, track medications, and get personalized insights
                </p>
            </div>

            {/* Quick Health Stats */}
            {healthMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid="rnf3v6s">
                    <div
                        className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                        data-oid="p6..hhn"
                    >
                        <div className="flex items-center justify-between" data-oid="zx61ncx">
                            <div data-oid="bkwnx20">
                                <p className="text-sm text-gray-600" data-oid="u3.gcn0">
                                    Health Score
                                </p>
                                <p className="text-2xl font-bold text-[#1F1F6F]" data-oid="apy4hg4">
                                    {healthMetrics.riskAssessment.overall}/100
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                                data-oid="y9xvn4g"
                            >
                                ❤️
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                        data-oid="kaa0qe0"
                    >
                        <div className="flex items-center justify-between" data-oid="--05gaj">
                            <div data-oid="367k6.0">
                                <p className="text-sm text-gray-600" data-oid="f-6awq5">
                                    BMI
                                </p>
                                <p className="text-2xl font-bold text-[#14274E]" data-oid="jxz:t8b">
                                    {healthMetrics.bmi.value}
                                </p>
                                <p className="text-xs text-gray-500 capitalize" data-oid=":n4fr-t">
                                    {healthMetrics.bmi.category}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                                data-oid="k74ft3s"
                            >
                                ⚖️
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                        data-oid="msw:6h3"
                    >
                        <div className="flex items-center justify-between" data-oid="ocxd:k2">
                            <div data-oid="4kehs9d">
                                <p className="text-sm text-gray-600" data-oid="9d52oy9">
                                    Medication Adherence
                                </p>
                                <p className="text-2xl font-bold text-[#394867]" data-oid=":ozco-j">
                                    {healthMetrics.medicationAdherence.overall}%
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                                data-oid="3rl1rlm"
                            >
                                💊
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                        data-oid="_6zqgte"
                    >
                        <div className="flex items-center justify-between" data-oid="81dc_ql">
                            <div data-oid="fb:kxax">
                                <p className="text-sm text-gray-600" data-oid="ktkn6eu">
                                    Active Goals
                                </p>
                                <p className="text-2xl font-bold text-[#9BA4B4]" data-oid="ml--z7i">
                                    {healthMetrics.goalProgress.active}
                                </p>
                                <p className="text-xs text-gray-500" data-oid="f5g-0jj">
                                    {healthMetrics.goalProgress.onTrack} on track
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center"
                                data-oid="18ydrpc"
                            >
                                🎯
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Health Alerts */}
            {healthInsights && healthInsights.alerts.length > 0 && (
                <div
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                    data-oid="pejr7vo"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center" data-oid="9u6kr4:">
                        <span className="mr-2" data-oid="d-frdjd">
                            🔔
                        </span>
                        Health Alerts
                    </h3>
                    <div className="space-y-3" data-oid="6uf428t">
                        {healthInsights.alerts.slice(0, 3).map((alert, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border-l-4 ${
                                    alert.severity === 'critical'
                                        ? 'bg-red-50 border-red-500'
                                        : alert.severity === 'warning'
                                          ? 'bg-yellow-50 border-yellow-500'
                                          : 'bg-blue-50 border-blue-500'
                                }`}
                                data-oid="o87ft.a"
                            >
                                <div
                                    className="flex items-start justify-between"
                                    data-oid="z9zqgjo"
                                >
                                    <div data-oid="_jsti87">
                                        <p className="font-medium text-gray-900" data-oid="3bx_.-l">
                                            {alert.message}
                                        </p>
                                        {alert.dueDate && (
                                            <p
                                                className="text-sm text-gray-600 mt-1"
                                                data-oid="n5jgxh_"
                                            >
                                                Due: {alert.dueDate.toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    {alert.actionRequired && (
                                        <button
                                            className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50"
                                            data-oid="7paa8r3"
                                        >
                                            Take Action
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-200" data-oid="f80r3.6">
                <nav className="flex space-x-8 overflow-x-auto" data-oid="qe23x0g">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            data-oid="h3st6rg"
                        >
                            <span className="mr-2" data-oid="yeihbzp">
                                {tab.icon}
                            </span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div
                className="bg-white rounded-xl shadow-lg border border-gray-100"
                data-oid="s2:s1do"
            >
                {activeTab === 'overview' && (
                    <div className="p-6" data-oid="hpzacv4">
                        <h3 className="text-lg font-semibold mb-6" data-oid="ce6yeso">
                            Health Overview
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="27yfq9t">
                            {/* Personal Summary */}
                            <div className="space-y-4" data-oid="w:8.fy0">
                                <h4 className="font-medium text-gray-900" data-oid="here_vb">
                                    Personal Information
                                </h4>
                                <div className="space-y-2 text-sm" data-oid="92hm6dx">
                                    <div className="flex justify-between" data-oid="urdmk7j">
                                        <span className="text-gray-600" data-oid="44.m3wg">
                                            Age:
                                        </span>
                                        <span data-oid="jwv80i.">
                                            {new Date().getFullYear() -
                                                new Date(
                                                    healthProfile.personalInfo.dateOfBirth,
                                                ).getFullYear()}{' '}
                                            years
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="9m6hxnb">
                                        <span className="text-gray-600" data-oid="a7zq93v">
                                            Gender:
                                        </span>
                                        <span className="capitalize" data-oid="z92r-lp">
                                            {healthProfile.personalInfo.gender}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="hv-h66_">
                                        <span className="text-gray-600" data-oid="jxh-bzd">
                                            Blood Type:
                                        </span>
                                        <span data-oid="4l0z7hu">
                                            {healthProfile.personalInfo.bloodType}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="8.y:lxk">
                                        <span className="text-gray-600" data-oid="wbcmaw:">
                                            Height:
                                        </span>
                                        <span data-oid="p47_xcu">
                                            {healthProfile.personalInfo.height} cm
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="zdcccw7">
                                        <span className="text-gray-600" data-oid="pgx.-fl">
                                            Weight:
                                        </span>
                                        <span data-oid="j_ayd.c">
                                            {healthProfile.personalInfo.weight} kg
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Health Summary */}
                            <div className="space-y-4" data-oid="v2ptfg8">
                                <h4 className="font-medium text-gray-900" data-oid="p_b_pin">
                                    Health Summary
                                </h4>
                                <div className="space-y-2 text-sm" data-oid="3y_usl8">
                                    <div className="flex justify-between" data-oid="7h::120">
                                        <span className="text-gray-600" data-oid="9alt90_">
                                            Chronic Conditions:
                                        </span>
                                        <span data-oid=".xm:g4-">
                                            {healthProfile.chronicConditions.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid=":c1p8a5">
                                        <span className="text-gray-600" data-oid=".8-:q4i">
                                            Current Medications:
                                        </span>
                                        <span data-oid="qcq28uy">
                                            {healthProfile.currentMedications.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="w26lo52">
                                        <span className="text-gray-600" data-oid="abqgvs_">
                                            Known Allergies:
                                        </span>
                                        <span data-oid="kpnw3bl">
                                            {healthProfile.allergies.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="5l-5i4s">
                                        <span className="text-gray-600" data-oid="9s:kmdn">
                                            Active Goals:
                                        </span>
                                        <span data-oid="7y2cjl1">
                                            {
                                                healthProfile.healthGoals.filter(
                                                    (g) => g.status === 'active',
                                                ).length
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="3:3ax:t">
                                        <span className="text-gray-600" data-oid="iqsg_aw">
                                            Emergency Contacts:
                                        </span>
                                        <span data-oid="s8xs0p5">
                                            {healthProfile.emergencyContacts.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-8" data-oid=":825ci1">
                            <h4 className="font-medium text-gray-900 mb-4" data-oid="nsyu-g7">
                                Recent Health Activity
                            </h4>
                            <div className="space-y-3" data-oid="opbmfub">
                                <div
                                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                                    data-oid="eixenud"
                                >
                                    <div
                                        className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3"
                                        data-oid="repjfkm"
                                    >
                                        💊
                                    </div>
                                    <div data-oid="fjw149y">
                                        <p className="text-sm font-medium" data-oid="qistgiz">
                                            Medication adherence updated
                                        </p>
                                        <p className="text-xs text-gray-600" data-oid="pa5.p_p">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                                    data-oid="-c1iifj"
                                >
                                    <div
                                        className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                                        data-oid="mjyvjgb"
                                    >
                                        🎯
                                    </div>
                                    <div data-oid="1:ownbu">
                                        <p className="text-sm font-medium" data-oid=":p0pgg8">
                                            Weight goal progress updated
                                        </p>
                                        <p className="text-xs text-gray-600" data-oid="nzcxx7w">
                                            1 day ago
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                                    data-oid="v.lxegl"
                                >
                                    <div
                                        className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3"
                                        data-oid="5_6vd_c"
                                    >
                                        📋
                                    </div>
                                    <div data-oid="ez8lzsq">
                                        <p className="text-sm font-medium" data-oid="_iapb_6">
                                            Lab results added
                                        </p>
                                        <p className="text-xs text-gray-600" data-oid="orr7mst">
                                            3 days ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'personal' && (
                    <PersonalInfoTab
                        personalInfo={healthProfile.personalInfo}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="90veqjk"
                    />
                )}

                {activeTab === 'medical-history' && (
                    <MedicalHistoryTab
                        medicalHistory={healthProfile.medicalHistory}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="ex13z6e"
                    />
                )}

                {activeTab === 'allergies' && (
                    <AllergiesTab
                        allergies={healthProfile.allergies}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="7flasny"
                    />
                )}

                {activeTab === 'medications' && (
                    <MedicationsTab
                        medications={healthProfile.currentMedications}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="2ucl35u"
                    />
                )}

                {activeTab === 'conditions' && (
                    <ChronicConditionsTab
                        conditions={healthProfile.chronicConditions}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="vxt5w94"
                    />
                )}

                {activeTab === 'emergency' && (
                    <EmergencyContactsTab
                        contacts={healthProfile.emergencyContacts}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid=":009-f5"
                    />
                )}

                {activeTab === 'goals' && (
                    <HealthGoalsTab
                        goals={healthProfile.healthGoals}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="eqrgow-"
                    />
                )}

                {activeTab === 'insights' && healthInsights && healthMetrics && (
                    <HealthInsightsTab
                        insights={healthInsights}
                        metrics={healthMetrics}
                        customerId={customerId}
                        data-oid="gslq129"
                    />
                )}

                {activeTab === 'preferences' && (
                    <PreferencesTab
                        preferences={healthProfile.preferences}
                        customerId={customerId}
                        onUpdate={loadHealthProfile}
                        data-oid="bisz.gu"
                    />
                )}
            </div>
        </div>
    );
}
