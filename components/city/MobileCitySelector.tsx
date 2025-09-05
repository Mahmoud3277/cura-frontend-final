'use client';

import { useState, useRef, useEffect } from 'react';
import { useCity } from '@/lib/contexts/CityContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { searchCitiesWithAdminSettings } from '@/lib/data/cities';
import { City } from '@/lib/data/cities';

interface MobileCitySelectorProps {
    placeholder?: string;
    onSelect?: (city: City) => void;
}

export function MobileCitySelector({ placeholder, onSelect }: MobileCitySelectorProps) {
    const { selectedCity, setSelectedCity, availableCities, adminSettings } = useCity();
    const { t, language } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState(availableCities);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter cities based on search query and admin settings
    useEffect(() => {
        if (searchQuery.trim()) {
            const results = searchCitiesWithAdminSettings(
                searchQuery,
                adminSettings.enabledCityIds,
                language,
            );
            setFilteredCities(results);
        } else {
            setFilteredCities(availableCities);
        }
    }, [searchQuery, language, availableCities, adminSettings.enabledCityIds]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCitySelect = (city: City) => {
        setSelectedCity(city);
        setIsOpen(false);
        setSearchQuery('');
        onSelect?.(city);
    };

    const getCityDisplayName = (city: City) => {
        return language === 'ar' ? city.nameAr : city.nameEn;
    };

    const getGovernorateDisplayName = (city: City) => {
        return language === 'ar' ? city.governorateNameAr : city.governorateName;
    };

    return (
        <div className="relative" ref={dropdownRef} data-oid="th5aw25">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1.5 px-1 py-1 text-sm font-medium text-gray-700 hover:text-[#1F1F6F] transition-colors"
                aria-label="Select city"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                data-oid="2dtz8ws"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="jddytzr"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        data-oid="1-h.js1"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        data-oid="ead7-.9"
                    />
                </svg>
                <span className="text-sm truncate max-w-[70px]" data-oid="860vllu">
                    {selectedCity ? getCityDisplayName(selectedCity) : 'City'}
                </span>
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid=":5u9i7i"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                        data-oid="-gxz-9h"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    data-oid="ff77b0e"
                >
                    <div className="p-3" data-oid="6ub3scz">
                        <input
                            type="text"
                            placeholder={placeholder || 'Search cities...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                            aria-label="Search cities"
                            data-oid="joe2sws"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto" data-oid="e21v.3i">
                        {filteredCities.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                data-oid="c-vye9n"
                            >
                                <div
                                    className="font-medium text-gray-900 text-sm"
                                    data-oid="2go457q"
                                >
                                    {getCityDisplayName(city)}
                                </div>
                                <div className="text-xs text-gray-500" data-oid="kw8s_gm">
                                    {getGovernorateDisplayName(city)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
