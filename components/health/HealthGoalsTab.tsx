'use client';

import { HealthGoal } from '@/lib/types';

interface HealthGoalsTabProps {
    goals: HealthGoal[];
    customerId: string;
    onUpdate: () => void;
}

export function HealthGoalsTab({ goals, customerId, onUpdate }: HealthGoalsTabProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'weight':
                return '⚖️';
            case 'exercise':
                return '🏃';
            case 'medication':
                return '💊';
            case 'nutrition':
                return '🥗';
            case 'lifestyle':
                return '🌟';
            default:
                return '🎯';
        }
    };

    return (
        <div className="p-6" data-oid="7-q19q5">
            <div className="flex items-center justify-between mb-6" data-oid="h8gunnc">
                <h3 className="text-lg font-semibold" data-oid="uu1vo6b">
                    Health Goals
                </h3>
                <button
                    className="bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                    data-oid="ffm21xx"
                >
                    Add Goal
                </button>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-12" data-oid="tv7dolo">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="6xo8rac"
                    >
                        <span className="text-2xl" data-oid="-82_-4v">
                            🎯
                        </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2" data-oid="k6::2ar">
                        No Health Goals Set
                    </h4>
                    <p className="text-gray-600" data-oid="4etc-og">
                        Set health goals to track your progress and stay motivated.
                    </p>
                </div>
            ) : (
                <div className="space-y-4" data-oid="axxh.dn">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="hecv.k_"
                        >
                            <div
                                className="flex items-start justify-between mb-3"
                                data-oid="inv5noh"
                            >
                                <div className="flex items-center" data-oid="d6wpkgn">
                                    <span className="text-2xl mr-3" data-oid="dwkzy6b">
                                        {getCategoryIcon(goal.category)}
                                    </span>
                                    <div data-oid="6ct9r59">
                                        <h4
                                            className="font-medium text-gray-900"
                                            data-oid="kj32yue"
                                        >
                                            {goal.title}
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="hrxz6-f">
                                            {goal.description}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}
                                    data-oid="w:x6j9s"
                                >
                                    {goal.status}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3" data-oid=".z_z70i">
                                <div
                                    className="flex justify-between text-sm mb-1"
                                    data-oid="97wtk-_"
                                >
                                    <span className="text-gray-600" data-oid="r:me9lx">
                                        Progress
                                    </span>
                                    <span className="font-medium" data-oid="f2kv.g5">
                                        {goal.progress}%
                                    </span>
                                </div>
                                <div
                                    className="w-full bg-gray-200 rounded-full h-2"
                                    data-oid="nzc62lv"
                                >
                                    <div
                                        className="bg-[#1F1F6F] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${goal.progress}%` }}
                                        data-oid="r4.2ki3"
                                    ></div>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
                                data-oid="3b1cfgg"
                            >
                                {goal.currentValue !== undefined &&
                                    goal.targetValue !== undefined && (
                                        <div data-oid="m256df3">
                                            <span className="text-gray-600" data-oid="trt2r33">
                                                Current:
                                            </span>
                                            <span className="ml-2 font-medium" data-oid="r:3rmot">
                                                {goal.currentValue} {goal.unit}
                                            </span>
                                        </div>
                                    )}
                                {goal.targetValue !== undefined && (
                                    <div data-oid="tikk19x">
                                        <span className="text-gray-600" data-oid="hh.q69y">
                                            Target:
                                        </span>
                                        <span className="ml-2 font-medium" data-oid="gj2w6wh">
                                            {goal.targetValue} {goal.unit}
                                        </span>
                                    </div>
                                )}
                                {goal.targetDate && (
                                    <div data-oid="847_wex">
                                        <span className="text-gray-600" data-oid="5m..uxe">
                                            Target Date:
                                        </span>
                                        <span className="ml-2" data-oid="tqs8c9u">
                                            {new Date(goal.targetDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {goal.milestones.length > 0 && (
                                <div className="mt-3" data-oid="bl69riv">
                                    <span
                                        className="text-sm text-gray-600 font-medium"
                                        data-oid="_81u3c-"
                                    >
                                        Recent Milestones:
                                    </span>
                                    <div className="mt-2 space-y-1" data-oid="t5ndx04">
                                        {goal.milestones.slice(-3).map((milestone) => (
                                            <div
                                                key={milestone.id}
                                                className="flex items-center text-sm"
                                                data-oid="c5i0q.g"
                                            >
                                                <span
                                                    className={`w-2 h-2 rounded-full mr-2 ${
                                                        milestone.achieved
                                                            ? 'bg-green-500'
                                                            : 'bg-gray-300'
                                                    }`}
                                                    data-oid="1lxiue8"
                                                ></span>
                                                <span className="text-gray-700" data-oid="vms0tjf">
                                                    {milestone.title}
                                                </span>
                                                <span
                                                    className="text-gray-500 ml-auto"
                                                    data-oid="ahnlxla"
                                                >
                                                    {new Date(milestone.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
