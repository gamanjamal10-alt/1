
import { useAppContext } from './useAppContext';
import { translations } from '../utils/translations';
import { Language } from '../types';

export const useTranslations = () => {
  const { language } = useAppContext();

  const langKey = (): keyof typeof translations => {
    switch (language) {
      case Language.AR: return 'ar';
      case Language.FR: return 'fr';
      default: return 'en';
    }
  };

  return (key: keyof typeof translations.en, replacements?: { [key: string]: string }) => {
    const currentLang = langKey();
    let text = translations[currentLang][key] || translations.en[key];
    
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(`{{${placeholder}}}`, replacements[placeholder]);
        });
    }

    return text;
  };
};