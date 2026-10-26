import { TRANSLATIONS, WORLD_LANGUAGES, TranslationSchema } from '../data/translations';

export interface AuditResult {
  language: string;
  isComplete: boolean;
  missingKeys: string[];
  totalKeys: number;
  appNameExact: boolean;
  taglineExact: boolean;
}

export function runLocalizationAudit(): {
  overallPass: boolean;
  supportedLanguages: string[];
  results: Record<string, AuditResult>;
} {
  const supportedLanguages = WORLD_LANGUAGES.map(l => l.code);
  const results: Record<string, AuditResult> = {};
  let overallPass = true;

  // Flatten object keys helper
  const getKeys = (obj: any, prefix = ''): string[] => {
    let keys: string[] = [];
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  const enKeys = getKeys(TRANSLATIONS.en);

  for (const lang of supportedLanguages) {
    const dict = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] as TranslationSchema;
    const missingKeys: string[] = [];

    if (!dict) {
      results[lang] = {
        language: lang,
        isComplete: false,
        missingKeys: enKeys,
        totalKeys: enKeys.length,
        appNameExact: false,
        taglineExact: false,
      };
      overallPass = false;
      continue;
    }

    const appNameExact = dict.appName === 'Mumora';
    const taglineExact = dict.tagline === 'Healthy Moms ♥ Brighter Tomorrows';

    if (!appNameExact || !taglineExact) {
      overallPass = false;
    }

    // Check each key in nested dictionary
    const getValueByPath = (o: any, path: string): any => {
      const parts = path.split('.');
      let current = o;
      for (const p of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[p];
      }
      return current;
    };

    for (const keyPath of enKeys) {
      const val = getValueByPath(dict, keyPath);
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        missingKeys.push(keyPath);
      }
    }

    const isComplete = missingKeys.length === 0 && appNameExact && taglineExact;
    if (!isComplete) {
      overallPass = false;
    }

    results[lang] = {
      language: lang,
      isComplete,
      missingKeys,
      totalKeys: enKeys.length,
      appNameExact,
      taglineExact,
    };
  }

  return {
    overallPass,
    supportedLanguages,
    results,
  };
}
