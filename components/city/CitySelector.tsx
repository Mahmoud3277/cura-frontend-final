'use client';

import { useState, useRef, useEffect } from 'react';
import { useCity } from '@/lib/contexts/CityContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { searchCitiesWithAdminSettings } from '@/lib/data/cities';
import { City } from '@/lib/data/cities';
import { cityManagementService } from '@/lib/services/cityManagementService';
interface CitySelectorProps {
    variant?: 'header' | 'mobile' | 'modal' | 'inline';
    placeholder?: string;
    showStats?: boolean;
    onSelect?: (city: City) => void;
}

export function CitySelector({
    variant = 'header',
    placeholder,
    showStats = true,
    onSelect,
}: CitySelectorProps) {
    const { selectedCity, setSelectedCity, availableCities, adminSettings } = useCity();
    const { t, language } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter cities based on search query and admin settings
    useEffect(() => {
        loadCities();
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
    const loadCities = async()=>{
        try {
            
            // Use the city management service to get cities with status
            const citiesData =await  cityManagementService.getCitiesWithStatus({status:'enabled'});
            
            console.log('in component', citiesData)
            setFilteredCities(citiesData);
        } catch (error) {
            console.error('Error loading cities:', error);
        } finally {
        }
    }
    // Mobile variant (ultra-compact)
    if (variant === 'mobile') {
        return (
            <div className="relative" ref={dropdownRef} data-oid="mobile-city-selector">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-1 text-xs font-medium text-cura-primary hover:text-cura-secondary transition-colors"
                    aria-label="Select city"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    data-oid="mobile-city-btn"
                >
                    <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="mobile-location-icon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            data-oid="mobile-location-path1"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            data-oid="mobile-location-path2"
                        />
                    </svg>
                    <span className="text-xs truncate max-w-[60px]" data-oid="mobile-city-name">
                        {selectedCity ? getCityDisplayName(selectedCity) : 'City'}
                    </span>
                    <svg
                        className={`w-2 h-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="mobile-dropdown-arrow"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                            data-oid="mobile-dropdown-path"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                        data-oid="mobile-dropdown"
                    >
                        <div className="p-2" data-oid="mobile-search-container">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-cura-primary focus:border-cura-primary"
                                aria-label="Search cities"
                                data-oid="mobile-search-input"
                            />
                        </div>
                        <div className="max-h-40 overflow-y-auto" data-oid="mobile-cities-list">
                            {filteredCities && filteredCities.map((city) => (
                                <button
                                    key={city._id}
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    data-oid="mobile-city-option"
                                >
                                    <div
                                        className="font-medium text-gray-900 text-xs"
                                        data-oid="mobile-city-name-option"
                                    >
                                        {getCityDisplayName(city)}
                                    </div>
                                    <div
                                        className="text-[10px] text-gray-500"
                                        data-oid="mobile-governorate-name"
                                    >
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

    // Header variant (compact)
    if (variant === 'header') {
        return (
            <div className="relative" ref={dropdownRef} data-oid=":_1820s">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-1 px-2 py-1 text-sm font-medium text-cura-primary hover:text-cura-secondary transition-colors"
                    aria-label="Select city"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    data-oid="5x71s9v"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="8yig.1t"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            data-oid="-2lv6qh"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            data-oid="du9maat"
                        />
                    </svg>
                    <span className="text-sm truncate max-w-[80px]" data-oid="olt.nw:">
                        {selectedCity ? getCityDisplayName(selectedCity) : 'City'}
                    </span>
                    <svg
                        className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="u-cw.7e"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                            data-oid="7uf0igg"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                        data-oid="::cq8j:"
                    >
                        <div className="p-3" data-oid="76wa3c5">
                            <input
                                type="text"
                                placeholder="Search cities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-cura-primary"
                                aria-label="Search cities"
                                data-oid="h0.n95a"
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto" data-oid="m94-lyd">
                            {filteredCities.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    data-oid="9s.yr-5"
                                >
                                    <div
                                        className="font-medium text-gray-900 text-sm"
                                        data-oid="_d5qouq"
                                    >
                                        {getCityDisplayName(city)}
                                    </div>
                                    <div className="text-xs text-gray-500" data-oid="g0krx31">
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

    // Modal variant (full-featured)
    if (variant === 'modal') {
        return (
            <div className="space-y-4" data-oid="l616wvk">
                <div data-oid="06zo_i3">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        data-oid="5.z-x4o"
                    >
                        {t('city.selectYourCity')}
                    </label>
                    <input
                        type="text"
                        placeholder={placeholder || t('city.searchCities')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                        aria-label={placeholder || t('city.searchCities') || 'Search cities'}
                        data-oid=":e:84kx"
                    />
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto" data-oid="u0ukb3v">
                    {filteredCities.map((city) => (
                        <button
                            key={city.id}
                            onClick={() => handleCitySelect(city)}
                            className={`p-4 text-left rounded-xl border-2 transition-all ${
                                selectedCity?.id === city.id
                                    ? 'border-[#1F1F6F] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            data-oid="ed7p2q_"
                        >
                            <div className="flex justify-between items-center" data-oid="wzhit:e">
                                <div data-oid="obfqmq_">
                                    <div className="font-semibold text-gray-900" data-oid="tq4q1ay">
                                        {getCityDisplayName(city)}
                                    </div>
                                    <div className="text-sm text-gray-500" data-oid="93te9::">
                                        {getGovernorateDisplayName(city)}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {filteredCities.length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-oid="fu7frew">
                        <svg
                            className="w-12 h-12 mx-auto mb-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="-8ib0ch"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                data-oid="nrxnl:s"
                            />
                        </svg>
                        <p data-oid="uk9lb5j">{t('city.noCitiesFound')}</p>
                    </div>
                )}
            </div>
        );
    }

    // Inline variant (simple dropdown)
    return (
        <div className="relative" ref={dropdownRef} data-oid="b.ukd1n">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] bg-white"
                aria-label="Select city"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                data-oid="63osm:g"
            >
                <div className="flex justify-between items-center" data-oid="xzxn9ck">
                    <span
                        className={selectedCity ? 'text-gray-900' : 'text-gray-500'}
                        data-oid="2pc-mil"
                    >
                        {selectedCity
                            ? getCityDisplayName(selectedCity)
                            : placeholder || t('city.selectCity')}
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="gcem..5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                            data-oid="5vw88dp"
                        />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    data-oid="bw.6j04"
                >
                    <div className="p-3" data-oid="17s8r3n">
                        <input
                            type="text"
                            placeholder={t('city.searchCities')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                            aria-label={t('city.searchCities') || 'Search cities'}
                            data-oid="r-df:53"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto" data-oid="5mw0oz6">
                        {filteredCities.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                data-oid="6xlnmw9"
                            >
                                <div className="font-medium text-gray-900" data-oid="f-232zb">
                                    {getCityDisplayName(city)}
                                </div>
                                <div className="text-sm text-gray-500" data-oid="ofrps6o">
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
