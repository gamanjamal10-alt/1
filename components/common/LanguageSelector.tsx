
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Language } from '../../types';
import { LanguageIcon } from '../icons';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  return (
    <div className="relative">
      <LanguageIcon className="w-6 h-6 absolute start-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none w-full bg-white border border-gray-300 text-primary py-2 ps-10 pe-4 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-primary"
        aria-label="Select language"
      >
        <option value={Language.EN}>EN</option>
        <option value={Language.FR}>FR</option>
        <option value={Language.AR}>AR</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
