import { translations } from './locales.generated';
import type { SupportedLanguage } from './locales.generated';

class I18n {
  lang: SupportedLanguage = 'en';
  fallback: SupportedLanguage = 'en';

  t(key: string): string {
    const path = key.split('.');

    const fromCurrent = path.reduce<unknown>(
      (o, k) => (o as Record<string, unknown>)?.[k],
      translations[this.lang]
    );
    if (fromCurrent != null) return fromCurrent as string;

    const fromFallback = path.reduce<unknown>(
      (o, k) => (o as Record<string, unknown>)?.[k],
      translations[this.fallback]
    );

    return (fromFallback as string) ?? key;
  }

  setLanguage(lang: string): void {
    if (!translations[lang as SupportedLanguage] || this.lang === lang) return;
    this.lang = lang as SupportedLanguage;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('language-changed'));
    }
  }
}

export const i18n = new I18n();

if (typeof window !== 'undefined') {
  (window as unknown as { i18n: I18n }).i18n = i18n;
}

export { translations };
export type { SupportedLanguage };
