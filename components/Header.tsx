
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AgricultureIcon, LogoutIcon, EyeIcon, ShoppingCartIcon } from './icons';
import LanguageSelector from './common/LanguageSelector';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { currentUser, currentStore, logout, unselectStore, isPreviewing, setIsPreviewing, cart, navigateToDashboardView } = useAppContext();
  const t = useTranslations();

  const isBuyerRole = currentStore?.storeType === UserRole.WHOLESALER || currentStore?.storeType === UserRole.RETAILER;

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
            {isBuyerRole && (
                 <button 
                    onClick={() => navigateToDashboardView('cart')} 
                    className="relative text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
                    aria-label={t('shoppingCart')}
                 >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-primary bg-accent text-white text-xs flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                 </button>
            )}
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
