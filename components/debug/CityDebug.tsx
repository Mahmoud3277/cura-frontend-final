'use client';

import { useCity } from '@/lib/contexts/CityContext';

export function CityDebug() {
    const { selectedCity, availableCities, adminSettings, enableTestSettings } = useCity();

    return (
        <div
            className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50"
            data-oid="kr-cjwu"
        >
            <h3 className="font-bold text-sm mb-2" data-oid="wpz4fr1">
                City Debug Info
            </h3>

            <div className="text-xs space-y-1" data-oid="38k8d1c">
                <div data-oid="hi7b5y8">
                    <strong data-oid="pl9p0rr">Selected City:</strong>{' '}
                    {selectedCity ? selectedCity.nameEn : 'None'}
                </div>

                <div data-oid="kp70qlo">
                    <strong data-oid="v9qf4bo">Available Cities:</strong> {availableCities.length}
                </div>

                <div data-oid="ps::8:i">
                    <strong data-oid="ga:gwnk">Enabled City IDs:</strong>
                    <div
                        className="text-xs text-gray-600 max-h-20 overflow-y-auto"
                        data-oid="3quj:ry"
                    >
                        {adminSettings.enabledCityIds.join(', ')}
                    </div>
                </div>

                <div className="pt-2 border-t" data-oid="gm963l5">
                    <button
                        onClick={enableTestSettings}
                        className="w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        data-oid="hvf3deb"
                    >
                        Enable Test Cities
                    </button>
                </div>

                <div className="text-xs text-gray-500" data-oid="vu78teq">
                    Cross-city orders: {adminSettings.allowCrossCityOrders ? 'Yes' : 'No'}
                </div>
            </div>
        </div>
    );
}
