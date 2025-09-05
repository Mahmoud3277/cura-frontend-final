'use client';

import { HealthInsights, HealthMetrics } from '@/lib/services/healthProfileService';

interface HealthInsightsTabProps {
    insights: HealthInsights;
    metrics: HealthMetrics;
    customerId: string;
}

export function HealthInsightsTab({ insights, metrics }: HealthInsightsTabProps) {
    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-50 border-l-red-500';
            case 'medium':
                return 'bg-yellow-50 border-l-yellow-500';
            case 'low':
                return 'bg-blue-50 border-l-blue-500';
            default:
                return 'bg-gray-50 border-l-gray-500';
        }
    };

    return (
        <div className="p-6 space-y-8" data-oid="rgrhp5v">
            <h3 className="text-lg font-semibold" data-oid="dflfqtx">
                Health Insights & Analytics
            </h3>

            {/* Health Score Overview */}
            <div
                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-6 rounded-xl"
                data-oid="r0-se5."
            >
                <h4 className="text-lg font-semibold mb-4" data-oid="z2pmf8o">
                    Overall Health Score
                </h4>
                <div className="flex items-center justify-between" data-oid="y._mqxj">
                    <div className="text-3xl font-bold" data-oid="i.61z9-">
                        {insights.healthScore.overall}/100
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm" data-oid="a_67466">
                        <div data-oid="5uy787k">
                            <div className="opacity-75" data-oid="ia65vv3">
                                Medication
                            </div>
                            <div className="font-semibold" data-oid="h.04hor">
                                {insights.healthScore.categories.medication}/100
                            </div>
                        </div>
                        <div data-oid="g92tq1x">
                            <div className="opacity-75" data-oid="sk-_0c.">
                                Lifestyle
                            </div>
                            <div className="font-semibold" data-oid="p:tjbik">
                                {insights.healthScore.categories.lifestyle}/100
                            </div>
                        </div>
                        <div data-oid="re9c2ja">
                            <div className="opacity-75" data-oid="4kjclus">
                                Preventive
                            </div>
                            <div className="font-semibold" data-oid="2hnj6fp">
                                {insights.healthScore.categories.preventive}/100
                            </div>
                        </div>
                        <div data-oid="nkvpv3b">
                            <div className="opacity-75" data-oid="7_15bxc">
                                Chronic Care
                            </div>
                            <div className="font-semibold" data-oid="9-vmidp">
                                {insights.healthScore.categories.chronic}/100
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Factors */}
            <div data-oid="345m1-:">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="t9bpmin">
                    Risk Factors
                </h4>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    data-oid="77fgok6"
                >
                    {insights.riskFactors.map((risk, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="9w.k8zb"
                        >
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid=".0e_f2e"
                            >
                                <h5 className="font-medium text-gray-900" data-oid="b7outx2">
                                    {risk.factor}
                                </h5>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(risk.level)}`}
                                    data-oid="o0i9z8v"
                                >
                                    {risk.level} risk
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3" data-oid="xm9zmaf">
                                {risk.description}
                            </p>
                            <div data-oid="e6bmsd.">
                                <p
                                    className="text-xs font-medium text-gray-700 mb-1"
                                    data-oid="e4oe.7-"
                                >
                                    Recommendations:
                                </p>
                                <ul className="text-xs text-gray-600 space-y-1" data-oid=".6xsnnk">
                                    {risk.recommendations.slice(0, 3).map((rec, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start"
                                            data-oid="535vzjp"
                                        >
                                            <span
                                                className="text-[#1F1F6F] mr-1"
                                                data-oid=".8xyrfz"
                                            >
                                                •
                                            </span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Health Metrics */}
            <div data-oid="t-sbrw3">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="9d7:jc8">
                    Key Health Metrics
                </h4>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    data-oid="k0y31-1"
                >
                    <div
                        className="bg-white border border-gray-200 rounded-lg p-4"
                        data-oid="gd2k13z"
                    >
                        <div className="flex items-center justify-between mb-2" data-oid="0nfrcjv">
                            <span className="text-sm text-gray-600" data-oid="moml_:q">
                                BMI
                            </span>
                            <span className="text-2xl" data-oid="oj5:s6a">
                                ⚖️
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900" data-oid="x.qtdqy">
                            {metrics.bmi.value}
                        </div>
                        <div className="text-sm text-gray-600 capitalize" data-oid="rwj3_jf">
                            {metrics.bmi.category}
                        </div>
                    </div>

                    <div
                        className="bg-white border border-gray-200 rounded-lg p-4"
                        data-oid="jgzhtyk"
                    >
                        <div className="flex items-center justify-between mb-2" data-oid="w6iuv76">
                            <span className="text-sm text-gray-600" data-oid="183qqet">
                                Medication Adherence
                            </span>
                            <span className="text-2xl" data-oid="__kz285">
                                💊
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900" data-oid="1m7ce85">
                            {metrics.medicationAdherence.overall}%
                        </div>
                        <div className="text-sm text-gray-600" data-oid="rgq6g6r">
                            Overall adherence
                        </div>
                    </div>

                    <div
                        className="bg-white border border-gray-200 rounded-lg p-4"
                        data-oid=".2buen7"
                    >
                        <div className="flex items-center justify-between mb-2" data-oid="lb2n_ch">
                            <span className="text-sm text-gray-600" data-oid="2yke473">
                                Active Goals
                            </span>
                            <span className="text-2xl" data-oid="87668dw">
                                🎯
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900" data-oid="i40.cd3">
                            {metrics.goalProgress.active}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="4luxdxv">
                            {metrics.goalProgress.onTrack} on track
                        </div>
                    </div>

                    <div
                        className="bg-white border border-gray-200 rounded-lg p-4"
                        data-oid=":jt.ty9"
                    >
                        <div className="flex items-center justify-between mb-2" data-oid="cl-x4xz">
                            <span className="text-sm text-gray-600" data-oid="ys:q.uj">
                                Risk Assessment
                            </span>
                            <span className="text-2xl" data-oid="sai26kw">
                                📊
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900" data-oid="mf22l-b">
                            {metrics.riskAssessment.overall}/100
                        </div>
                        <div className="text-sm text-gray-600" data-oid="e6n2ag1">
                            Overall risk score
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div data-oid="rkuy-nk">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="9f4syq9">
                    Personalized Recommendations
                </h4>
                <div className="space-y-4" data-oid="n0mq216">
                    {insights.recommendations.map((rec, index) => (
                        <div
                            key={index}
                            className={`border-l-4 p-4 rounded-lg ${getPriorityColor(rec.priority)}`}
                            data-oid="jq7y-p:"
                        >
                            <div
                                className="flex items-start justify-between mb-2"
                                data-oid="bu36l-:"
                            >
                                <div data-oid="1cb7wuc">
                                    <h5 className="font-medium text-gray-900" data-oid="jq4nsm5">
                                        {rec.title}
                                    </h5>
                                    <p className="text-sm text-gray-600" data-oid="h7g-8dq">
                                        {rec.description}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        rec.priority === 'high'
                                            ? 'bg-red-100 text-red-800'
                                            : rec.priority === 'medium'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-blue-100 text-blue-800'
                                    }`}
                                    data-oid=":i4puoo"
                                >
                                    {rec.priority} priority
                                </span>
                            </div>
                            <div data-oid="on3fto8">
                                <p
                                    className="text-sm font-medium text-gray-700 mb-1"
                                    data-oid="kw27qbr"
                                >
                                    Action Items:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1" data-oid=".hf5mhc">
                                    {rec.actionItems.map((action, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start"
                                            data-oid=".:ii3y9"
                                        >
                                            <span
                                                className="text-[#1F1F6F] mr-2"
                                                data-oid="wqwvrld"
                                            >
                                                ✓
                                            </span>
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medication Adherence Details */}
            <div data-oid="7esv5zv">
                <h4 className="font-semibold text-gray-900 mb-4" data-oid="5_f6p2g">
                    Medication Adherence Breakdown
                </h4>
                <div className="space-y-3" data-oid="wo68ux:">
                    {metrics.medicationAdherence.byMedication.map((med, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="hf9dewb"
                        >
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="h09gafo"
                            >
                                <h5 className="font-medium text-gray-900" data-oid="22dzy6q">
                                    {med.name}
                                </h5>
                                <div className="flex items-center space-x-2" data-oid="jmhx10s">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            med.adherence >= 90
                                                ? 'bg-green-100 text-green-800'
                                                : med.adherence >= 80
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                        }`}
                                        data-oid="5s-pfgk"
                                    >
                                        {med.adherence}%
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            med.trend === 'improving'
                                                ? 'bg-green-100 text-green-800'
                                                : med.trend === 'stable'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : 'bg-red-100 text-red-800'
                                        }`}
                                        data-oid="sqbjua4"
                                    >
                                        {med.trend}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2" data-oid="x7pierb">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        med.adherence >= 90
                                            ? 'bg-green-500'
                                            : med.adherence >= 80
                                              ? 'bg-yellow-500'
                                              : 'bg-red-500'
                                    }`}
                                    style={{ width: `${med.adherence}%` }}
                                    data-oid="lk4hpwk"
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
