'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { CustomerMobileSideNavigation } from '@/components/mobile/CustomerMobileSideNavigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function CustomerSettingsPage() {
    const { user, updateProfile, loadUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Initialize accountData with safe defaults
    const [accountData, setAccountData] = useState({
        displayName: '',
        email: '',
        phone: '',
        language: 'en',
        street: '',
        city: '',
        governorate: '',
    });

    const [privacy, setPrivacy] = useState({
        profileVisibility: 'private',
        dataSharing: false,
        analytics: true,
    });

    // Update account data when user context is available
    useEffect(() => {
        if (user) {
            // Parse address if it exists
            let street = '', city = '', governorate = '';
            if (user.addresses && user.addresses.length > 0) {
                const address = user.addresses[0];
                street = address.street || '';
                city = address.city || '';
                governorate = address.governorate || address.state || '';
            }

            setAccountData((prev) => ({
                ...prev,
                displayName: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                street,
                city,
                governorate,
            }));
        }
    }, [user]);

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'security', label: 'Security' },
    ];

    const handleAccountDataChange = (field: string, value: string) => {
        setAccountData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveAccountChanges = async () => {
        setLoading(true);
        setSuccessMessage('');

        try {
            // Prepare data in the format expected by backend
            const updateData = {
                name: accountData.displayName,
                phone: accountData.phone,
                addresses: accountData.street || accountData.city || accountData.governorate ? [{
                    street: accountData.street,
                    city: accountData.city,
                    governorate: accountData.governorate,
                    country: 'Egypt'
                }] : []
            };

            console.log('Sending update data:', updateData);

            const { success, error } = await updateProfile(updateData);
            if (success) {
                setSuccessMessage('Account settings saved successfully!');

                // Hard reload the page to refresh with updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                console.error('Error saving account settings:', error);
                alert(`Failed to save changes: ${error}`);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred while saving changes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Mobile Layout */}
            <div className="block md:hidden min-h-screen bg-gray-50" data-oid="mobile-layout">
                <ResponsiveHeader data-oid="mobile-header" />
                <div className="px-4 py-6" data-oid="mobile-content">
                    <div className="mb-6" data-oid="mobile-title">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="mobile-h1">
                            Settings
                        </h1>
                        <div
                            className="h-1 w-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full"
                            data-oid="mobile-divider"
                        ></div>
                    </div>

                    {/* Mobile Settings Content */}
                    <div className="max-w-4xl mx-auto space-y-6" data-oid="sbkp8xn">
                        {/* Settings Tabs */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="0c_y479"
                        >
                            <div className="border-b border-gray-200" data-oid="nnar6zb">
                                <nav className="flex space-x-8 px-6" data-oid="kw-c0:1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                            data-oid="z6zc8aw"
                                        >
                                            <span data-oid="ozizkz1">{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-6" data-oid="ayi668x">
                                {activeTab === 'account' && (
                                    <div className="space-y-6" data-oid="0-lgspp">
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="doqz604"
                                        >
                                            Account Information
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6" data-oid="s1dyb6a">
                                            <div data-oid="tapb-_i">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="_8-fros"
                                                >
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountData.displayName}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'displayName',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="59j1ufw"
                                                />
                                            </div>
                                            <div data-oid="qpsv48w">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="767y7va"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={accountData.email}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="wf2kgj0"
                                                />
                                            </div>
                                            <div data-oid="qpsv48w">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="767y7va"
                                                >
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={accountData.phone}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Add phone number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="ohawnyi"
                                                />
                                            </div>
                                            <div data-oid="asz_83z">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="f5b2rm6"
                                                >
                                                    Language
                                                </label>
                                                <select
                                                    value={accountData.language}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'language',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="pq8:k02"
                                                >
                                                    <option value="en" data-oid="p_qxb1q">
                                                        English
                                                    </option>
                                                    <option value="ar" data-oid="75e3m66">
                                                        العربية
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div data-oid="s94oiqx">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-2"
                                                        data-oid="street-label-mobile"
                                                    >
                                                        Street Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={accountData.street}
                                                        onChange={(e) =>
                                                            handleAccountDataChange(
                                                                'street',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter street address"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                        data-oid="street-input-mobile"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-2"
                                                        data-oid="city-label-mobile"
                                                    >
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={accountData.city}
                                                        onChange={(e) =>
                                                            handleAccountDataChange(
                                                                'city',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter city"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                        data-oid="city-input-mobile"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-2"
                                                        data-oid="governorate-label-mobile"
                                                    >
                                                        Governorate
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={accountData.governorate}
                                                        onChange={(e) =>
                                                            handleAccountDataChange(
                                                                'governorate',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter governorate"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                        data-oid="governorate-input-mobile"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end" data-oid="d3os91e">
                                            <button
                                                onClick={handleSaveAccountChanges}
                                                disabled={loading}
                                                className="px-6 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                data-oid="hve_2dg"
                                            >
                                                {loading && (
                                                    <svg
                                                        className="animate-spin h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        data-oid=".1hdz2n"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            data-oid="iyh4aol"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            data-oid="x-j_p6u"
                                                        ></path>
                                                    </svg>
                                                )}
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6" data-oid="3:p7zg9">
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="cf4thz4"
                                        >
                                            Security Settings
                                        </h3>
                                        <div className="space-y-4" data-oid="gg0-5wa">
                                            <div
                                                className="p-4 bg-gray-50 rounded-lg"
                                                data-oid="xkmoy58"
                                            >
                                                <h4
                                                    className="font-medium text-gray-900 mb-4"
                                                    data-oid="t:7vadk"
                                                >
                                                    Change Password
                                                </h4>
                                                <div className="space-y-4" data-oid="aor8:m5">
                                                    <div data-oid="4y2qldx">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                            data-oid="g.k4svm"
                                                        >
                                                            Current Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="99y8rm9"
                                                        />
                                                    </div>
                                                    <div data-oid="cj0.wjy">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                            data-oid="_c.j:9n"
                                                        >
                                                            New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="ii:xof6"
                                                        />
                                                    </div>
                                                    <div data-oid="tozjj-9">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                            data-oid=".63lam:"
                                                        >
                                                            Confirm New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="cl3uvxy"
                                                        />
                                                    </div>
                                                    <button
                                                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                                        data-oid="rogm_pk"
                                                    >
                                                        Update Password
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                                                data-oid="lcr8-ry"
                                            >
                                                <h4
                                                    className="font-medium text-red-800 mb-2"
                                                    data-oid="w9jdtiy"
                                                >
                                                    Danger Zone
                                                </h4>
                                                <p
                                                    className="text-sm text-red-600 mb-4"
                                                    data-oid="rs-u90s"
                                                >
                                                    Permanently delete your account and all data
                                                </p>
                                                <button
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    data-oid="7vulvg_"
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile Bottom Padding - reduced since no floating nav */}
                <div className="h-4 md:hidden" data-oid="mobile-bottom-padding"></div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block" data-oid="desktop-layout">
                <DashboardLayout title="Settings" userType="customer" data-oid="desktop-settings">
                    <div className="max-w-4xl mx-auto space-y-6" data-oid="mrb4.7b">
                        {/* Settings Header */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="_swd412"
                        >
                            <h1
                                className="text-2xl font-bold text-gray-900 mb-2"
                                data-oid="cz97.:d"
                            >
                                Settings
                            </h1>
                            <p className="text-gray-600" data-oid="59mxp-c">
                                Manage your account preferences and settings
                            </p>
                        </div>

                        {/* Settings Tabs */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="uiv4q1-"
                        >
                            <div className="border-b border-gray-200" data-oid="6s6wzk:">
                                <nav className="flex space-x-8 px-6" data-oid="u:402-r">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                            data-oid="35or5.r"
                                        >
                                            <span data-oid="damq:v6">{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-6" data-oid="atgjrr3">
                                {activeTab === 'account' && (
                                    <div className="space-y-6" data-oid="o33m452">
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="z1prqox"
                                        >
                                            Account Information
                                        </h3>
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                            data-oid="wgat2j4"
                                        >
                                            <div data-oid="piotq4r">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="-a5ggos"
                                                >
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountData.displayName}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'displayName',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="dfg8zf:"
                                                />
                                            </div>
                                            <div data-oid="qwye-lz">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="uw95qw3"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={accountData.email}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="l1embfb"
                                                />
                                            </div>
                                            <div data-oid="m2dwnph">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="_994i:l"
                                                >
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={accountData.phone}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Add phone number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="axzmfiu"
                                                />
                                            </div>
                                            <div data-oid="q5y73kg">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="kh-azng"
                                                >
                                                    Language
                                                </label>
                                                <select
                                                    value={accountData.language}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'language',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="aek:6sm"
                                                >
                                                    <option value="en" data-oid=".botlkx">
                                                        English
                                                    </option>
                                                    <option value="ar" data-oid="n:2h1hs">
                                                        العربية
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div data-oid="street-field-desktop">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="street-label-desktop"
                                                >
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountData.street}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'street',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Enter street address"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="street-input-desktop"
                                                />
                                            </div>
                                            <div data-oid="city-field-desktop">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="city-label-desktop"
                                                >
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountData.city}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'city',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Enter city"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="city-input-desktop"
                                                />
                                            </div>
                                            <div data-oid="governorate-field-desktop">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="governorate-label-desktop"
                                                >
                                                    Governorate
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountData.governorate}
                                                    onChange={(e) =>
                                                        handleAccountDataChange(
                                                            'governorate',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Enter governorate"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="governorate-input-desktop"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end" data-oid="tzyrbbe">
                                            <button
                                                onClick={handleSaveAccountChanges}
                                                disabled={loading}
                                                className="px-6 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                data-oid="ba7:aom"
                                            >
                                                {loading && (
                                                    <svg
                                                        className="animate-spin h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        data-oid="go6da9z"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            data-oid="4qykldr"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            data-oid="jcdnv5n"
                                                        ></path>
                                                    </svg>
                                                )}
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6" data-oid="2b-guvx">
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="k082trq"
                                        >
                                            Security Settings
                                        </h3>
                                        <div className="space-y-4" data-oid="28ac8g_">
                                            <div
                                                className="p-4 bg-gray-50 rounded-lg"
                                                data-oid="hgnhvff"
                                            >
                                                <h4
                                                    className="font-medium text-gray-900 mb-4"
                                                    data-oid="2qu3j5z"
                                                >
                                                    Change Password
                                                </h4>
                                                <div className="space-y-4" data-oid="mp4pbsv">
                                                    <div data-oid="jn6.8:2">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                            data-oid="-6_n20y"
                                                        >
                                                            Current Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="52pb_9_"
                                                        />
                                                    </div>
                                                    <div data-oid="3_qg00v">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                            data-oid="oij9am0"
                                                        >
                                                            New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="bwo:r3b"
                                                        />
                                                    </div>
                                                    <div data-oid="qqq9o_-">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-2"
                                                            data-oid="edzo:co"
                                                        >
                                                            Confirm New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="i.jf90u"
                                                        />
                                                    </div>
                                                    <button
                                                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                                        data-oid="f_3rp3-"
                                                    >
                                                        Update Password
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                                                data-oid="-xu14:n"
                                            >
                                                <h4
                                                    className="font-medium text-red-800 mb-2"
                                                    data-oid="rpgc-mw"
                                                >
                                                    Danger Zone
                                                </h4>
                                                <p
                                                    className="text-sm text-red-600 mb-4"
                                                    data-oid="_15u_w3"
                                                >
                                                    Permanently delete your account and all data
                                                </p>
                                                <button
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    data-oid="4ss8-q9"
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            </div>
        </>
    );
}
