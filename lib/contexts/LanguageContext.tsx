'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

interface LanguageContextType {
    locale: string;
    setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
    initialLocale?: string;
}

export function LanguageProvider({ children, initialLocale = 'en' }: LanguageProviderProps) {
    const [locale, setLocaleState] = useState(initialLocale);
    const { i18n } = useI18nTranslation();

    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);
        // Use i18next to change language
        if (i18n) {
            i18n.changeLanguage(newLocale);
        }
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('cura-locale', newLocale);
        }
    };

    // Load locale from localStorage on mount and sync with i18next
    useEffect(() => {
        if (typeof window !== 'undefined' && i18n) {
            const savedLocale = localStorage.getItem('cura-locale');
            if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
                setLocaleState(savedLocale);
                i18n.changeLanguage(savedLocale);
            } else {
                // Use i18next's detected language
                const detectedLang = i18n.language || 'en';
                setLocaleState(detectedLang);
            }
        }
    }, [i18n]);

    // Listen to i18next language changes
    useEffect(() => {
        if (!i18n) return;

        const handleLanguageChange = (lng: string) => {
            setLocaleState(lng);
        };

        i18n.on('languageChanged', handleLanguageChange);
        return () => i18n.off('languageChanged', handleLanguageChange);
    }, [i18n]);

    // Update document language only (no direction change)
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
            // Keep direction as LTR always
            document.documentElement.dir = 'ltr';
        }
    }, [locale]);

    return (
        <LanguageContext.Provider value={{ locale, setLocale }} data-oid="ie7ja2w">
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
