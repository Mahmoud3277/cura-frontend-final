'use client';

import { useCity } from '@/lib/contexts/CityContext';
import { CitySelector } from '@/components/city/CitySelector';

interface LocationPromptProps {
    title?: string;
    description?: string;
    showStats?: boolean;
}

export function LocationPrompt({
    title = 'Select Your Location',
    description = 'Please select your city to view available products and pharmacies in your area.',
    showStats = true,
}: LocationPromptProps) {
    const { selectedCity } = useCity();

    // Don't show if city is already selected
    if (selectedCity) {
        return null;
    }

    return (
        <div
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100"
            data-oid="b-8umrh"
        >
            <div className="text-6xl mb-4" data-oid="p3olzgz">
                📍
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-oid="3nmpfg-">
                {title}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto" data-oid="k3owhjd">
                {description}
            </p>

            <div className="max-w-md mx-auto" data-oid="a2inx3o">
                <CitySelector
                    variant="modal"
                    showStats={showStats}
                    placeholder="Search for your city..."
                    data-oid="rm-9y1c"
                />
            </div>

            <div className="mt-6 text-sm text-gray-500" data-oid="josxb5g">
                <p data-oid="4mt35h5">
                    🏥 Only products and services available in your selected area will be shown
                </p>
            </div>
        </div>
    );
}
