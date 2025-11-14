import React, { useState, useEffect } from 'react';
import { useAppContext } from './hooks/useAppContext';
// FIX: Imported Language enum to resolve reference errors.
import { UserRole, Language } from './types';
import LoginScreen from './screens/LoginScreen';
import Header from './components/Header';
import FarmerDashboard from './screens/dashboards/FarmerDashboard';
import WholesalerDashboard from './screens/dashboards/WholesalerDashboard';
import RetailerDashboard from './screens/dashboards/RetailerDashboard';
import TransportDashboard from './screens/dashboards/TransportDashboard';
import AdminDashboard from './screens/dashboards/AdminDashboard';
import ChooseStoreTypeScreen from './screens/ChooseStoreTypeScreen';
import RegisterScreen from './screens/RegisterScreen';

type AppState = 'login' | 'chooseType' | 'register' | 'loggedIn';

const App: React.FC = () => {
  const { currentUser, language, setLanguage } = useAppContext();
  const [appState, setAppState] = useState<AppState>('login');
  const [roleToRegister, setRoleToRegister] = useState<UserRole | null>(null);
  
  useEffect(() => {
    document.documentElement.lang = language === Language.AR ? 'ar' : 'en';
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);
  
  useEffect(() => {
    if (currentUser) {
      setAppState('loggedIn');
    } else {
      setAppState('login');
    }
  }, [currentUser]);

  const renderDashboard = () => {
    if (!currentUser) return null; // Should not happen in 'loggedIn' state
    
    switch (currentUser.accountType) {
      case UserRole.FARMER:
        return <FarmerDashboard />;
      case UserRole.WHOLESALER:
        return <WholesalerDashboard />;
      case UserRole.RETAILER:
        return <RetailerDashboard />;
      case UserRole.TRANSPORT:
        return <TransportDashboard />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Error: Unknown user role.</div>;
    }
  };
  
  const handleSelectRole = (role: UserRole) => {
      setRoleToRegister(role);
      setAppState('register');
  }

  const renderState = () => {
    switch(appState) {
        case 'chooseType':
            return <ChooseStoreTypeScreen onSelectRole={handleSelectRole} />;
        case 'register':
            if (!roleToRegister) { // Should not happen
                setAppState('chooseType');
                return null;
            }
            return <RegisterScreen role={roleToRegister} onRegisterSuccess={() => setAppState('login')} />;
        case 'loggedIn':
            return (
                <div className="min-h-screen bg-secondary">
                    <Header />
                    <main>{renderDashboard()}</main>
                </div>
            );
        case 'login':
        default:
            return <LoginScreen onLoginSuccess={() => setAppState('loggedIn')} onGoToRegister={() => setAppState('chooseType')} />;
    }
  }

  return <div className={`font-sans ${language === Language.AR ? 'font-[Tajawal]' : ''}`}>{renderState()}</div>;
};

export default App;
