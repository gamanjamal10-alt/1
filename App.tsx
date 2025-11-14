
import React, { useState, useEffect } from 'react';
import { useAppContext } from './hooks/useAppContext';
import { UserRole, Language } from './types';
import LoginScreen from './screens/LoginScreen';
import Header from './components/Header';
import FarmerDashboard from './screens/dashboards/FarmerDashboard';
import WholesalerDashboard from './screens/dashboards/WholesalerDashboard';
import RetailerDashboard from './screens/dashboards/RetailerDashboard';
import TransportDashboard from './screens/dashboards/TransportDashboard';
import AdminDashboard from './screens/dashboards/AdminDashboard';
import StoreSelectionScreen from './screens/StoreSelectionScreen';
import UserRegisterScreen from './screens/UserRegisterScreen';

type AuthState = 'login' | 'register';

const App: React.FC = () => {
  const { currentUser, currentStore, language } = useAppContext();
  const [authState, setAuthState] = useState<AuthState>('login');
  
  useEffect(() => {
    document.documentElement.lang = language === Language.AR ? 'ar' : 'en';
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);

  const renderDashboard = () => {
    if (!currentStore) return null;
    
    // Check for admin user with special store
    if (currentUser?.email === 'admin@example.com' && currentStore.storeType === UserRole.ADMIN) {
        return <AdminDashboard />;
    }
    
    switch (currentStore.storeType) {
      case UserRole.FARMER:
        return <FarmerDashboard />;
      case UserRole.WHOLESALER:
        return <WholesalerDashboard />;
      case UserRole.RETAILER:
        return <RetailerDashboard />;
      case UserRole.TRANSPORT:
        return <TransportDashboard />;
      default:
        // Handle other roles or show an error/generic dashboard
        return <div>Dashboard for {currentStore.storeType} coming soon.</div>;
    }
  };

  const renderContent = () => {
      if (!currentUser) {
          if (authState === 'register') {
              return <UserRegisterScreen onRegisterSuccess={() => setAuthState('login')} />;
          }
          return <LoginScreen onGoToRegister={() => setAuthState('register')} />;
      }

      if (currentUser && !currentStore) {
          return <StoreSelectionScreen />;
      }
      
      if (currentUser && currentStore) {
        return (
            <div className="min-h-screen bg-secondary">
                <Header />
                <main>{renderDashboard()}</main>
            </div>
        );
      }
      
      return null;
  }

  return <div className={`font-sans ${language === Language.AR ? 'font-[Tajawal]' : ''}`}>{renderContent()}</div>;
};

export default App;
