
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AgricultureIcon, LogoutIcon, EyeIcon } from './icons';
import LanguageSelector from './common/LanguageSelector';

const Header: React.FC = () => {
  const { currentUser, currentStore, logout, unselectStore, isPreviewing, setIsPreviewing } = useAppContext();
  const t = useTranslations();

  return (
    <header className="bg-primary text-secondary p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <AgricultureIcon className="h-10 w-10 text-accent" />
        <h1 className="text-xl md:text-2xl font-bold">{t('soukElFellah')}</h1>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <LanguageSelector />
        {currentUser && (
          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <div className="text-end hidden sm:block">
              <p className="font-semibold">{currentUser.fullName}</p>
              {currentStore && <p className="text-xs text-gray-300">{currentStore.storeName}</p>}
            </div>
            {currentStore && (
                <>
                <button
                    onClick={() => setIsPreviewing(!isPreviewing)}
                    className="bg-accent text-white hover:bg-green-700 font-bold py-2 px-3 rounded-lg transition duration-300 text-sm flex items-center space-x-2 rtl:space-x-reverse"
                    aria-label={t('viewStore')}
                >
                    <EyeIcon className="h-5 w-5"/>
                    <span className="hidden md:inline">{isPreviewing ? t('backToDashboard') : t('viewStore')}</span>
                </button>
                <button
                    onClick={unselectStore}
                    className="bg-secondary text-primary hover:bg-yellow-50 font-bold py-2 px-3 rounded-lg transition duration-300 text-sm"
                >
                    {t('switchStore')}
                </button>
                </>
            )}
            <button
              onClick={logout}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition duration-300"
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
