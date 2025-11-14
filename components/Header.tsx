
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { AgricultureIcon, LogoutIcon } from './icons';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-primary text-secondary p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <AgricultureIcon className="h-10 w-10 text-accent" />
        <h1 className="text-xl md:text-2xl font-bold">Souk El Fellah</h1>
      </div>
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
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
