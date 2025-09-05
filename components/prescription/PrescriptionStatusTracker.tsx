'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import {
    PrescriptionWorkflow,
    PrescriptionStatus,
    PrescriptionUrgency,
    PrescriptionWorkflowManager,
} from '@/lib/data/prescriptionWorkflow';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import { getAuthToken } from '@/lib/utils/cookies';

interface PrescriptionStatusTrackerProps {
    prescriptionId?: string;
    showFilters?: boolean;
    compact?: boolean;
}

export function PrescriptionStatusTracker({
    prescriptionId,
    showFilters = true,
    compact = false,
}: PrescriptionStatusTrackerProps) {
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );
    const [filters, setFilters] = useState<{
        status?: PrescriptionStatus;
        urgency?: PrescriptionUrgency;
        dateFrom?: string;
        dateTo?: string;
    }>({});
    const [notifications, setNotifications] = useState<string[]>([]);
    const { user } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        loadPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, prescriptionId, filters]);

    useEffect(() => {
        // Set up real-time updates (in production, this would be WebSocket)
        const interval = setInterval(() => {
            if (user) {
                loadPrescriptions();
            }
        }, 30000); // Check for updates every 30 seconds
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    const getUser = async()=>{
        const token = getAuthToken();
        if(token){
            console.log(token)
            const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,{
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            })
            const data = await user.json()
            console.log(data)
            return data.data.user._id;
        }
    }
    const loadPrescriptions = async () => {
        try {
            setIsLoading(true);
            const user = await getUser()
            let data: PrescriptionWorkflow[];
            if(user){
                const token = getAuthToken()
                console.log('getting prescriptions', user)
                const prescription = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions?customerId=${user}`,{
                    headers:{
                        "Content-Type":"application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });
                data = await prescription.json();
                console.log(data, 'prescriptions')
                setPrescriptions(data.data);
            }
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getUrgencyColor = (urgency: PrescriptionUrgency) => {
        switch (urgency) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'routine':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTimelineSteps = () => [
        {
            status: 'submitted',
            label: t('prescription.status.timeline.prescriptionSubmitted'),
            icon: '📝',
        },
        {
            status: 'reviewing',
            label: t('prescription.status.timeline.underPharmacistReview'),
            icon: '👨‍⚕️',
        },
        {
            status: 'approved',
            label: t('prescription.status.timeline.prescriptionApproved'),
            icon: 'success',
        },
    ];

    const isStepCompleted = (stepStatus: string, currentStatus: PrescriptionStatus) => {
        const statusOrder = ['submitted', 'reviewing', 'approved'];
        const stepIndex = statusOrder.indexOf(stepStatus);
        const currentIndex = statusOrder.indexOf(currentStatus);
        return stepIndex <= currentIndex;
    };

    const showNotification = (message: string) => {
        setNotifications((prev) => [...prev, message]);
        setTimeout(() => {
            setNotifications((prev) => prev.slice(1));
        }, 5000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8" data-oid="acm30dw">
                <div
                    className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                    data-oid="fw569do"
                ></div>
                <span className="ml-3 text-gray-600" data-oid="458xgy6">
                    {t('prescription.status.loading')}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="4uurv7x">
            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="fixed top-4 right-4 z-50 space-y-2" data-oid="9smct0d">
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right"
                            data-oid="-6e5_z5"
                        >
                            {notification}
                        </div>
                    ))}
                </div>
            )}

            {/* Prescriptions List */}
            <div className="space-y-4" data-oid="zmdnnix">
                {prescriptions.length === 0 ? (
                    <div
                        className="text-center py-12 bg-white rounded-lg border border-gray-200"
                        data-oid="aftzy89"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="8pb32q_"
                        >
                            <svg
                                className="w-8 h-8 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="d3tg8z5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                                    clipRule="evenodd"
                                    data-oid="hou4:3d"
                                />

                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6h-3a2 2 0 00-2 2v3H6a2 2 0 01-2-2V5zm8 8a1 1 0 011-1h3v2a2 2 0 01-2 2h-2v-3z"
                                    clipRule="evenodd"
                                    data-oid="fuwjds4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="3tyn_us">
                            {t('prescription.status.noResults')}
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="n7qdy4f">
                            {t('prescription.status.noResultsDescription')}
                        </p>
                        <a
                            href="/prescription/upload"
                            className="inline-block bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            data-oid="jg5n6c8"
                        >
                            {t('prescription.status.uploadFirst')}
                        </a>
                    </div>
                ) : (
                    prescriptions && prescriptions.map((prescription) => (
                        <div
                            key={prescription._id}
                            className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                                compact ? 'p-4' : 'overflow-hidden'
                            }`}
                            data-oid="_g2uw9b"
                        >
                            {!compact && (
                                <div
                                    className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 px-4 md:px-6 py-3 md:py-4 border-b border-gray-100"
                                    data-oid="gy68ej9"
                                >
                                    <div
                                        className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0"
                                        data-oid="wm7znsq"
                                    >
                                        <div data-oid="4xqrp7x">
                                            <h3
                                                className="text-base md:text-lg font-semibold text-gray-900"
                                                data-oid="v_m2ce."
                                            >
                                                {t('prescription.status.title')} {prescription._id}
                                            </h3>
                                            <p
                                                className="text-xs md:text-sm text-gray-600"
                                                data-oid="9nhgdf8"
                                            >
                                                {t('prescription.status.details.submittedOn')}{' '}
                                                {(prescription.createdAt)}
                                            </p>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="vpkl1if"
                                        >
                                            <span
                                                className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${PrescriptionWorkflowManager.getStatusColor(
                                                    prescription.currentStatus,
                                                )}`}
                                                data-oid="w093u90"
                                            >
                                                {PrescriptionWorkflowManager.getStatusIcon(
                                                    prescription.currentStatus,
                                                )}{' '}
                                                {t(
                                                    `prescription.status.statuses.${prescription.currentStatus.replace(
                                                        '-',
                                                        '',
                                                    )}`,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className={compact ? '' : 'p-4 md:p-6'} data-oid="3f6w_qv">
                                {/* Progress Bar */}
                                <div className="mb-4 md:mb-6" data-oid="gwjdmse">
                                    <div
                                        className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-2"
                                        data-oid=".jzc5sl"
                                    >
                                        <span data-oid="m:-b7rb">
                                            {t('prescription.status.statusHistory.progress')}
                                        </span>
                                        <span data-oid="h:kgna2">
                                            {PrescriptionWorkflowManager.getWorkflowProgress(
                                                prescription.currentStatus,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="ynl5qqk"
                                    >
                                        <div
                                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${PrescriptionWorkflowManager.getWorkflowProgress(
                                                    prescription.currentStatus,
                                                )}%`,
                                            }}
                                            data-oid="9dm1dmc"
                                        ></div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mb-4 md:mb-6" data-oid="xz8oaq1">
                                    <h4
                                        className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base"
                                        data-oid="ijaeist"
                                    >
                                        {t('prescription.status.timeline.title')}
                                    </h4>
                                    <div className="space-y-2 md:space-y-3" data-oid="e7:ki9g">
                                        {getTimelineSteps().map((step, index) => {
                                            const completed = isStepCompleted(
                                                step.status,
                                                prescription.currentStatus,
                                            );
                                            const isCurrent =
                                                step.status === prescription.currentStatus;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-3"
                                                    data-oid="fptfnjz"
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                                            completed
                                                                ? isCurrent
                                                                    ? 'bg-[#1F1F6F] text-white animate-pulse'
                                                                    : 'bg-green-500 text-white'
                                                                : 'bg-gray-300 text-gray-600'
                                                        }`}
                                                        data-oid="mnctpp-"
                                                    >
                                                        {completed ? (
                                                            isCurrent ? (
                                                                <div
                                                                    className="w-2 h-2 bg-white rounded-full animate-ping"
                                                                    data-oid="bt69p9."
                                                                ></div>
                                                            ) : (
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    data-oid="swjc1t1"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                        data-oid="dk530d3"
                                                                    />
                                                                </svg>
                                                            )
                                                        ) : step.icon === 'success' ? (
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                                data-oid="ktt5fqk"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                    data-oid="r82597f"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            step.icon
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-xs md:text-sm ${
                                                            completed
                                                                ? isCurrent
                                                                    ? 'text-[#1F1F6F] font-semibold'
                                                                    : 'text-gray-900'
                                                                : 'text-gray-500'
                                                        }`}
                                                        data-oid="ae:y45j"
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Processed Medicines */}
                                {prescription.medications &&
                                    prescription.medications.length > 0 && (
                                        <div className="mb-4 md:mb-6" data-oid="c9_6m0z">
                                            <h4
                                                className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base"
                                                data-oid="vnx_wnl"
                                            >
                                                {t(
                                                    'prescription.status.medicines.processedMedicines',
                                                )}
                                            </h4>
                                            <div
                                                className="space-y-2 md:space-y-3"
                                                data-oid="2_excnv"
                                            >
                                                {prescription.medications.map((medicine) => (
                                                    <div
                                                        key={medicine.id._id}
                                                        className="p-3 md:p-4 bg-gray-50 rounded-lg"
                                                        data-oid="g:czsu-"
                                                    >
                                                        <div data-oid="rlvy.ig">
                                                            <p
                                                                className="font-medium text-gray-900 text-sm md:text-base"
                                                                data-oid="-827el:"
                                                            >
                                                                {medicine.name}
                                                            </p>
                                                            <p
                                                                className="text-xs md:text-sm text-gray-600"
                                                                data-oid=":pr7hyh"
                                                            >
                                                                {t(
                                                                    'prescription.status.medicines.quantity',
                                                                )}{' '}
                                                                {medicine.quantity} |{' '}
                                                                {t(
                                                                    'prescription.status.medicines.instructions',
                                                                )}{' '}
                                                                {medicine.instructions}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                {/* Actions */}
                                <div
                                    className="flex flex-col md:flex-row md:items-center justify-end pt-3 md:pt-4 border-t border-gray-200 space-y-2 md:space-y-0"
                                    data-oid="tbxjlbd"
                                >
                                    <div
                                        className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3"
                                        data-oid="4z-7fmd"
                                    >
                                        {prescription.currentStatus === 'approved' && (
                                            <a
                                                href={`/prescription/medicines/${prescription._id}`}
                                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 inline-block text-center text-sm md:text-base"
                                                data-oid="lob93ln"
                                            >
                                                {t('prescription.status.actions.selectMedicines')}
                                            </a>
                                        )}
                                        {prescription.currentStatus !== 'approved' &&
                                            prescription.currentStatus !== 'rejected' &&
                                            prescription.currentStatus !== 'cancelled' && (
                                                <div
                                                    className="text-xs md:text-sm text-gray-600 text-center md:text-left"
                                                    data-oid="897u:ww"
                                                >
                                                    {prescription.currentStatus === 'submitted' &&
                                                        t(
                                                            'prescription.status.actions.waitingReview',
                                                        )}
                                                    {prescription.currentStatus === 'reviewing' &&
                                                        t(
                                                            'prescription.status.actions.underReview',
                                                        )}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Expanded Details - Status History */}
                                {selectedPrescription?.id === prescription.id && (
                                    <div
                                        className="mt-6 pt-6 border-t border-gray-200"
                                        data-oid="d4mju:k"
                                    >
                                        <h4
                                            className="font-semibold text-gray-900 mb-4"
                                            data-oid="1u506rk"
                                        >
                                            {t('prescription.status.statusHistory.title')}
                                        </h4>
                                        <div className="space-y-4" data-oid="z-h3c7-">
                                            {prescription.statusHistory.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start space-x-4"
                                                    data-oid="q4jq0f6"
                                                >
                                                    <div
                                                        className="w-10 h-10 bg-[#1F1F6F] rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                        data-oid="3c02p.7"
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1" data-oid="xdc_5o7">
                                                        <div
                                                            className="flex items-center justify-between"
                                                            data-oid=".j.:fp5"
                                                        >
                                                            <p
                                                                className="font-medium text-gray-900"
                                                                data-oid="w9ae:hr"
                                                            >
                                                                {t(
                                                                    `prescription.status.statuses.${entry.status.replace('-', '')}`,
                                                                )}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="-vjeb-l"
                                                            >
                                                                {(entry.timestamp)}
                                                            </p>
                                                        </div>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="elx9_be"
                                                        >
                                                            {t(
                                                                'prescription.status.statusHistory.by',
                                                            )}{' '}
                                                            {entry.userName} ({entry.userRole})
                                                        </p>
                                                        {entry.notes && (
                                                            <p
                                                                className="text-sm text-gray-600 mt-1"
                                                                data-oid="uun3gkc"
                                                            >
                                                                {entry.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
