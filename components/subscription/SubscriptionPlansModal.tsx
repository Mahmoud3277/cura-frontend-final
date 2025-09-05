'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { SubscriptionPlan } from '@/lib/services/subscriptionService';

interface SubscriptionPlansModalProps {
    plans: SubscriptionPlan[];
    onClose: () => void;
    onSelectPlan: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlansModal({
    plans,
    onClose,
    onSelectPlan,
}: SubscriptionPlansModalProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    const getFrequencyColor = (frequency: string) => {
        switch (frequency) {
            case 'weekly':
                return 'bg-blue-100 text-blue-800';
            case 'bi-weekly':
                return 'bg-green-100 text-green-800';
            case 'monthly':
                return 'bg-purple-100 text-purple-800';
            case 'quarterly':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            data-oid="ieo9bvu"
        >
            <div
                className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                data-oid="yresms4"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200" data-oid="3dxlf3-">
                    <div className="flex justify-between items-center" data-oid="kzr5vad">
                        <div data-oid="jchavog">
                            <h2 className="text-2xl font-bold text-gray-900" data-oid="wapr115">
                                {t('subscription.plans.title')}
                            </h2>
                            <p className="text-gray-600 mt-1" data-oid="kqw2rjh">
                                {t('subscription.plans.description')}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            data-oid="9h1nfks"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="fjvx69a"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="gn73jzp"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]" data-oid="jsfq44a">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="9h1lyls">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                data-oid="aww3dw."
                            >
                                {/* Plan Header */}
                                <div className="text-center mb-6" data-oid=":sdmsfq">
                                    <div
                                        className="flex items-center justify-center gap-3 mb-3"
                                        data-oid="4-yw0ee"
                                    >
                                        <h3
                                            className="text-xl font-bold text-gray-900"
                                            data-oid="1o_fj-j"
                                        >
                                            {locale === 'ar' ? plan.nameAr : plan.name}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getFrequencyColor(plan.frequency)}`}
                                            data-oid="um8:vuk"
                                        >
                                            {t(`subscription.frequency.${plan.frequency}`)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm" data-oid="g5j9pv-">
                                        {locale === 'ar' ? plan.descriptionAr : plan.description}
                                    </p>
                                </div>

                                {/* Pricing Display */}
                                <div className="text-center mb-6" data-oid="iuq.1.n">
                                    <div
                                        className="bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-xl p-4 text-white"
                                        data-oid="ydchxa6"
                                    >
                                        <div className="text-3xl font-bold mb-1" data-oid=".06iibu">
                                            {plan.monthlyFee} EGP
                                        </div>
                                        <div className="text-sm opacity-90 mb-2" data-oid="7pixwt2">
                                            Monthly subscription fee
                                        </div>
                                        <div
                                            className="bg-white bg-opacity-20 rounded-lg p-2"
                                            data-oid="rb6ajb4"
                                        >
                                            <div
                                                className="text-lg font-semibold text-green-300"
                                                data-oid="ju8_6aa"
                                            >
                                                Save {plan.medicineDiscount} EGP per medicine
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Details */}
                                <div className="space-y-4 mb-6" data-oid="perj5gd">
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="amx_ito"
                                    >
                                        <span className="text-gray-600" data-oid="i0s59np">
                                            Min Order Value:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="x1p16ea"
                                        >
                                            {plan.minOrderValue} EGP
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="j7isj:j"
                                    >
                                        <span className="text-gray-600" data-oid="5c_65g.">
                                            Order Savings:
                                        </span>
                                        <span
                                            className="font-medium text-green-600"
                                            data-oid="2l94xx_"
                                        >
                                            {plan.orderDiscount} EGP per order
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="z-juiee"
                                    >
                                        <span className="text-gray-600" data-oid="s9vrq:0">
                                            Monthly Fee:
                                        </span>
                                        <span
                                            className="font-medium text-[#1F1F6F]"
                                            data-oid="zcyr6xl"
                                        >
                                            {plan.monthlyFee} EGP
                                        </span>
                                    </div>
                                </div>

                                {/* Medicine Guarantee */}
                                <div
                                    className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6"
                                    data-oid="0.7hufj"
                                >
                                    <div
                                        className="flex items-center gap-2 text-green-800 mb-2"
                                        data-oid="0u-7rq2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="7k:w4sf"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="f1xtsyp"
                                            />
                                        </svg>
                                        <span className="font-medium text-sm" data-oid="2fjou3y">
                                            Medicine Availability Guarantee
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-700" data-oid="3os1.4l">
                                        CURA will provide the exact medicine when possible. If
                                        unavailable, we{"'"}ll call you to offer alternatives at the
                                        same discounted price.
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mb-6" data-oid="7p-69uj">
                                    <h4
                                        className="font-medium text-gray-900 mb-3"
                                        data-oid="c:hkeq2"
                                    >
                                        {t('subscription.plans.features')}:
                                    </h4>
                                    <ul className="space-y-2" data-oid=":8but-h">
                                        {(locale === 'ar' ? plan.featuresAr : plan.features).map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2 text-sm text-gray-600"
                                                    data-oid="czfoww0"
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-green-500 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="1ooq3yu"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                            data-oid="c1zi9jj"
                                                        />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                {/* Select Button */}
                                <button
                                    onClick={() => onSelectPlan(plan)}
                                    className="w-full py-3 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors font-medium"
                                    data-oid="yeukvu1"
                                >
                                    {t('subscription.plans.selectPlan')}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="mt-8" data-oid="_h1bz.j">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="alrt8xe">
                            {t('subscription.plans.comparison')}
                        </h3>
                        <div className="overflow-x-auto" data-oid="9l_49w-">
                            <table
                                className="w-full border border-gray-200 rounded-lg"
                                data-oid="6d6vcmj"
                            >
                                <thead className="bg-gray-50" data-oid="qb08va7">
                                    <tr data-oid="mc.algz">
                                        <th
                                            className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                                            data-oid=":un7x2q"
                                        >
                                            {t('subscription.plans.plan')}
                                        </th>
                                        <th
                                            className="px-4 py-3 text-center text-sm font-medium text-gray-900"
                                            data-oid="qqfq.l_"
                                        >
                                            {t('subscription.plans.frequency')}
                                        </th>
                                        <th
                                            className="px-4 py-3 text-center text-sm font-medium text-gray-900"
                                            data-oid="2qot783"
                                        >
                                            {t('subscription.plans.discount')}
                                        </th>
                                        <th
                                            className="px-4 py-3 text-center text-sm font-medium text-gray-900"
                                            data-oid="ozos54w"
                                        >
                                            {t('subscription.plans.minOrder')}
                                        </th>
                                        <th
                                            className="px-4 py-3 text-center text-sm font-medium text-gray-900"
                                            data-oid=".v:bez:"
                                        >
                                            {t('subscription.plans.features')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200" data-oid="i:9yl_j">
                                    {plans.map((plan) => (
                                        <tr
                                            key={plan.id}
                                            className="hover:bg-gray-50"
                                            data-oid="h:ey8gn"
                                        >
                                            <td className="px-4 py-3" data-oid="hhy:egv">
                                                <div
                                                    className="font-medium text-gray-900"
                                                    data-oid="ah.y.9x"
                                                >
                                                    {locale === 'ar' ? plan.nameAr : plan.name}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="cr-u3wk"
                                                >
                                                    {locale === 'ar'
                                                        ? plan.descriptionAr
                                                        : plan.description}
                                                </div>
                                            </td>
                                            <td
                                                className="px-4 py-3 text-center"
                                                data-oid="6p7jfb-"
                                            >
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(plan.frequency)}`}
                                                    data-oid="iqcg-pw"
                                                >
                                                    {t(`subscription.frequency.${plan.frequency}`)}
                                                </span>
                                            </td>
                                            <td
                                                className="px-4 py-3 text-center"
                                                data-oid="lcr5o3k"
                                            >
                                                <span
                                                    className="font-medium text-green-600"
                                                    data-oid="ot9g95d"
                                                >
                                                    {plan.discount}%
                                                </span>
                                            </td>
                                            <td
                                                className="px-4 py-3 text-center"
                                                data-oid="uuyxyb."
                                            >
                                                <span className="text-gray-900" data-oid="-4kh4w7">
                                                    {plan.minOrderValue} {t('common.currency')}
                                                </span>
                                            </td>
                                            <td
                                                className="px-4 py-3 text-center"
                                                data-oid="tv_5_:a"
                                            >
                                                <span className="text-gray-600" data-oid="aeihwnu">
                                                    {
                                                        (locale === 'ar'
                                                            ? plan.featuresAr
                                                            : plan.features
                                                        ).length
                                                    }{' '}
                                                    {t('subscription.plans.featuresCount')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div
                        className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
                        data-oid=":k0l6zm"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="78z17bc">
                            {t('subscription.plans.whySubscribe')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="nt8d0i2">
                            <div className="text-center" data-oid="o7gc05o">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"
                                    data-oid=":_3ivbg"
                                >
                                    <span className="text-2xl" data-oid="h-a:qm7">
                                        💰
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="iraol:g">
                                    {t('subscription.plans.benefit1Title')}
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="q2_zkgx">
                                    {t('subscription.plans.benefit1Description')}
                                </p>
                            </div>
                            <div className="text-center" data-oid="tcm717i">
                                <div
                                    className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
                                    data-oid="1vj:chg"
                                >
                                    <span className="text-2xl" data-oid="oe44jyn">
                                        🚚
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="upqxn:x">
                                    {t('subscription.plans.benefit2Title')}
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="r9hggf6">
                                    {t('subscription.plans.benefit2Description')}
                                </p>
                            </div>
                            <div className="text-center" data-oid="b54.der">
                                <div
                                    className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"
                                    data-oid="5452hi8"
                                >
                                    <span className="text-2xl" data-oid="g.3a_jm">
                                        ⏰
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2" data-oid="d3lvhk2">
                                    {t('subscription.plans.benefit3Title')}
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="d42nmzi">
                                    {t('subscription.plans.benefit3Description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200" data-oid="dhq5a6x">
                    <div className="flex justify-end" data-oid="e7r4gr2">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            data-oid="88rimeu"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
