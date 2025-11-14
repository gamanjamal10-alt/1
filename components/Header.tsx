
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AgricultureIcon, LogoutIcon } from './icons';
import LanguageSelector from './common/LanguageSelector';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const t = useTranslations();

  return (
    <header className="bg-primary text-secondary p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <AgricultureIcon className="h-10 w-10 text-accent" />
        <h1 className="text-xl md:text-2xl font-bold">{t('soukElFellah')}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold">{currentUser.fullName}</p>
              <p className="text-xs text-gray-300">{currentUser.accountType}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-accent hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              aria-label="Logout"
            >
              <LogoutIcon className="h-5 w-5" />
              <span className="hidden md:inline">{t('logout')}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;