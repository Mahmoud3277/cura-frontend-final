'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface LanguageSwitcherProps {
    className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, setLocale } = useLanguage();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'العربية' },
    ];

    const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        setLocale(langCode);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} data-oid="q_tvq6h">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#1F1F6F] transition-colors duration-200 bg-white/80 backdrop-blur-sm"
                aria-label="Select language"
                data-oid="nrlavzq"
            >
                <span className="text-sm font-medium text-gray-700" data-oid="1b1s-w7">
                    {currentLanguage.code.toUpperCase()}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="q-kzx15"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                        data-oid="4659anp"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full mt-1 right-0 w-40 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    data-oid="6nky4rb"
                >
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 ${
                                locale === language.code
                                    ? 'bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 text-[#1F1F6F]'
                                    : 'text-gray-700'
                            }`}
                            data-oid="24oho9z"
                        >
                            <span className="text-sm font-medium" data-oid="y9dn62v">
                                {language.name}
                            </span>
                            {locale === language.code && (
                                <svg
                                    className="w-4 h-4 text-[#1F1F6F]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="ge:cmcn"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                        data-oid="8nvjcr-"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                    data-oid="vkgexx2"
                />
            )}
        </div>
    );
}
