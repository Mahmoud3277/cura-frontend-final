// This file should only run on the client side
import { createI18nInstance } from './client';

let i18n: any = null;

if (typeof window !== 'undefined') {
    i18n = createI18nInstance();
}

export default i18n;