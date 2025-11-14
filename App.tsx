
import React from 'react';
import { useAppContext } from './hooks/useAppContext';
import { UserRole } from './types';
import LoginScreen from './screens/LoginScreen';
import Header from './components/Header';
import FarmerDashboard from './screens/dashboards/FarmerDashboard';
import WholesalerDashboard from './screens/dashboards/WholesalerDashboard';
import RetailerDashboard from './screens/dashboards/RetailerDashboard';
import TransportDashboard from './screens/dashboards/TransportDashboard';
import AdminDashboard from './screens/dashboards/AdminDashboard';

const App: React.FC = () => {
  const { currentUser } = useAppContext();

  const renderDashboard = () => {
    if (!currentUser) return <LoginScreen />;
    
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
        return (
          <div>
            <p>Error: Unknown user role.</p>
          </div>
        );
    }
  };

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;