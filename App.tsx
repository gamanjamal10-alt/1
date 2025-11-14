
import React, { useState } from 'react';
import { useAppContext } from './hooks/useAppContext';
import { UserRole } from './types';
import LoginScreen from './screens/LoginScreen';
import Header from './components/Header';
import FarmerDashboard from './screens/dashboards/FarmerDashboard';
import BuyerDashboard from './screens/dashboards/BuyerDashboard';
import TransportDashboard from './screens/dashboards/TransportDashboard';
import ProductDetailScreen from './screens/ProductDetailScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import Button from './components/common/Button';

type View = 'dashboard' | 'productDetail' | 'myOrders';

const App: React.FC = () => {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('productDetail');
  };

  const handleBackToDashboard = () => {
    setSelectedProductId(null);
    setCurrentView('dashboard');
  };

  const renderDashboard = () => {
    if (!currentUser) return null;
    
    const isBuyer = currentUser.accountType === UserRole.WHOLESALER || currentUser.accountType === UserRole.RETAILER;

    return (
      <>
        {isBuyer && (
             <div className="p-4 md:p-8 md:pt-0">
                <Button onClick={() => setCurrentView('myOrders')} className="w-auto">View My Orders</Button>
            </div>
        )}
        {
          (() => {
            switch (currentUser.accountType) {
              case UserRole.FARMER:
                return <FarmerDashboard />;
              case UserRole.WHOLESALER:
              case UserRole.RETAILER:
                return <BuyerDashboard role={currentUser.accountType} onSelectProduct={handleSelectProduct} />;
              case UserRole.TRANSPORT:
                return <TransportDashboard />;
              default:
                return <div>Invalid user role.</div>;
            }
          })()
        }
      </>
    );
  };

  const renderContent = () => {
    if (currentView === 'productDetail' && selectedProductId) {
      return <ProductDetailScreen productId={selectedProductId} onBack={handleBackToDashboard} />;
    }
    if (currentView === 'myOrders') {
        return <MyOrdersScreen onBack={handleBackToDashboard} />
    }
    return renderDashboard();
  };

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
