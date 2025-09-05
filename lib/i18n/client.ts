'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly to avoid async loading issues
import enCommon from '../../public/locales/en/common.json';
import enProducts from '../../public/locales/en/products.json';
import enDashboard from '../../public/locales/en/dashboard.json';
import enHomepage from '../../public/locales/en/homepage.json';
import enContact from '../../public/locales/en/contact.json';
import enPharmacy from '../../public/locales/en/pharmacy.json';
import enCustomer from '../../public/locales/en/customer.json';
import arCommon from '../../public/locales/ar/common.json';
import arProducts from '../../public/locales/ar/products.json';
import arDashboard from '../../public/locales/ar/dashboard.json';
import arHomepage from '../../public/locales/ar/homepage.json';
import arContact from '../../public/locales/ar/contact.json';
import arPharmacy from '../../public/locales/ar/pharmacy.json';
import arCustomer from '../../public/locales/ar/customer.json';

export function createI18nInstance() {
    const i18nInstance = i18n.createInstance();

    i18nInstance
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            debug: process.env.NODE_ENV === 'development',

            // Fallback language
            fallbackLng: 'en',

            // Supported languages
            supportedLngs: ['en', 'ar'],

            // Namespace configuration
            defaultNS: 'common',
            ns: ['common', 'products', 'dashboard', 'homepage', 'contact', 'pharmacy', 'customer'],

            // Language detection configuration
            detection: {
                // Use localStorage for persistence (matching existing behavior)
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
                lookupLocalStorage: 'cura-locale', // Match existing key
            },

            // Interpolation configuration
            interpolation: {
                escapeValue: false, // React already escapes values
            },

            // React configuration
            react: {
                useSuspense: false, // Disable suspense to avoid hydration issues
            },

            // Load resources directly
            resources: {
                en: {
                    common: enCommon,
                    products: enProducts,
                    dashboard: enDashboard,
                    homepage: enHomepage,
                    contact: enContact,
                    pharmacy: enPharmacy,
                    customer: enCustomer,
                },
                ar: {
                    common: arCommon,
                    products: arProducts,
                    dashboard: arDashboard,
                    homepage: arHomepage,
                    contact: arContact,
                    pharmacy: arPharmacy,
                    customer: arCustomer,
                },
            },
        });

    return i18nInstance;
}

export default createI18nInstance();
