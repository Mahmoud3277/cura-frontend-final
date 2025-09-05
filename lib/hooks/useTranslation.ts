'use client';
import { useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

type TranslationKey = string;
type InterpolationParams = Record<string, string | number>;

export function useTranslation(locale?: string, namespace?: string) {
  const { t: i18nT, i18n, ready } = useI18nTranslation(namespace || 'common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const t = (key: TranslationKey, params?: InterpolationParams | string): string => {
    // Handle fallback string parameter
    if (typeof params === 'string') {
      return i18nT(key, { defaultValue: params });
    }

    // Handle interpolation parameters
    if (params && typeof params === 'object') {
      return i18nT(key, params);
    }

    // Always try to get translation, even if not fully ready
    const translation = i18nT(key);

    // If we get back the same key, it means translation wasn't found
    // In that case, provide a fallback based on the key
    if (translation === key) {
      // For common keys, provide reasonable fallbacks
      if (key === 'common.currency') return 'EGP';
      if (key === 'subscription.inDays') return 'in {days} days';
      if (key === 'subscription.today') return 'today';
      if (key === 'subscription.overdue') return 'overdue';

      // For other keys, try to make them readable
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      // Fixed: Added missing closing parenthesis for replace() method
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/([A-Z])/g, ' $1');
    }

    return translation;
  };

  return {
    t,
    isLoading: !ready || !isHydrated,
    locale: i18n?.language || 'en',
    language: i18n?.language || 'en'
  };
}

// Namespace-specific hooks
export function useCommonTranslation() {
  return useTranslation(undefined, 'common');
}

export function useProductsTranslation() {
  return useTranslation(undefined, 'products');
}

export function useDashboardTranslation() {
  return useTranslation(undefined, 'dashboard');
}

export function useHomepageTranslation() {
  return useTranslation(undefined, 'homepage');
}

export function useContactTranslation() {
  return useTranslation(undefined, 'contact');
}

export function usePharmacyTranslation() {
  return useTranslation(undefined, 'pharmacy');
}

export function useCustomerTranslation() {
  return useTranslation(undefined, 'customer');
}