import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  translations, 
  cropTranslations, 
  locationTranslations, 
  unitTranslations 
} from '../i18n/translations';

export interface LanguageOption {
  code: Language;
  label: string;
  native: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tCrop: (crop: string) => string;
  tLocation: (location: string) => string;
  tUnit: (unit: string) => string;
  tTrend: (trend: string) => string;
  tCategory: (cat: string) => string;
  formatPriceSentence: (crop: string, price: number, unit?: string) => string;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('language') || localStorage.getItem('app_language');
      if (saved === 'hi' || saved === 'mr' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read saved language from localStorage', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
      localStorage.setItem('app_language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Could not persist language to localStorage', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key] || translations['en'][key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  const tCrop = (crop: string): string => {
    if (!crop) return '';
    const trimmed = crop.trim();
    if (cropTranslations[trimmed]?.[language]) {
      return cropTranslations[trimmed][language];
    }
    // Check if partial matches exist
    for (const [key, mapping] of Object.entries(cropTranslations)) {
      if (trimmed.toLowerCase() === key.toLowerCase()) {
        return mapping[language];
      }
    }
    return crop;
  };

  const tLocation = (loc: string): string => {
    if (!loc) return '';
    const trimmed = loc.trim();
    if (locationTranslations[trimmed]?.[language]) {
      return locationTranslations[trimmed][language];
    }
    for (const [key, mapping] of Object.entries(locationTranslations)) {
      if (trimmed.toLowerCase() === key.toLowerCase()) {
        return mapping[language];
      }
    }
    return loc;
  };

  const tUnit = (unit: string): string => {
    if (!unit) return '';
    const trimmed = unit.trim();
    if (unitTranslations[trimmed]?.[language]) {
      return unitTranslations[trimmed][language];
    }
    return unit;
  };

  const tTrend = (trend: string): string => {
    const normalized = (trend || '').toLowerCase();
    if (normalized.includes('ris') || normalized.includes('up') || normalized.includes('surging')) {
      return language === 'hi' ? '📈 बढ़ रहा है' : language === 'mr' ? '📈 वाढणारा' : '📈 Rising';
    }
    if (normalized.includes('fall') || normalized.includes('down') || normalized.includes('softening')) {
      return language === 'hi' ? '📉 गिर रहा है' : language === 'mr' ? '📉 घसरणारा' : '📉 Falling';
    }
    if (normalized.includes('stab')) {
      return language === 'hi' ? '➡️ स्थिर' : language === 'mr' ? '➡️ स्थिर' : '➡️ Stable';
    }
    if (normalized.includes('volat')) {
      return language === 'hi' ? '⚠️ अस्थिर' : language === 'mr' ? '⚠️ चढ-उताराचा' : '⚠️ Volatile';
    }
    return trend;
  };

  const tCategory = (cat: string): string => {
    if (!cat) return '';
    const normalized = cat.toLowerCase();
    if (normalized.includes('veg')) return t('vegetables');
    if (normalized.includes('fruit')) return t('fruits');
    if (normalized.includes('grain')) return t('grainsPulses');
    if (normalized.includes('spice') || normalized.includes('cash')) return t('spicesCash');
    if (normalized === 'all') return t('all');
    return cat;
  };

  const formatPriceSentence = (crop: string, price: number, unit: string = '/kg'): string => {
    const translatedCrop = tCrop(crop);
    const translatedUnit = tUnit(unit);
    return t('priceDynamicSentence', {
      crop: translatedCrop,
      price: price,
      unit: translatedUnit
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tCrop,
        tLocation,
        tUnit,
        tTrend,
        tCategory,
        formatPriceSentence,
        availableLanguages: AVAILABLE_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
