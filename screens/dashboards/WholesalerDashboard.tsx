
import React, { useState } from 'react';
import { UserRole } from '../../types';
import DashboardLayout from '../../components/common/DashboardLayout';
import BuyerDashboard from './BuyerDashboard';
import ProductDetailScreen from '../ProductDetailScreen';
import MyOrdersScreen from '../MyOrdersScreen';
import ProfileSettingsScreen from '../ProfileSettingsScreen';
import { DashboardIcon, CartIcon, HistoryIcon, SettingsIcon } from '../../components/icons';

const WholesalerDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const navItems = [
        { label: 'Wholesale Offers', view: 'dashboard', icon: DashboardIcon },
        { label: 'My Orders', view: 'orders', icon: CartIcon },
        { label: 'Order History', view: 'history', icon: HistoryIcon },
        { label: 'Profile Settings', view: 'settings', icon: SettingsIcon },
    ];

    const handleSelectProduct = (productId: string) => {
        setSelectedProductId(productId);
    };

    const handleBack = () => {
        setSelectedProductId(null);
    };

    const renderContent = () => {
        if (selectedProductId) {
            return <ProductDetailScreen productId={selectedProductId} onBack={handleBack} />;
        }
        
        switch (activeView) {
            case 'orders':
                return <MyOrdersScreen orderFilter="active" />;
            case 'history':
                return <MyOrdersScreen orderFilter="history" />;
            case 'settings':
                return <ProfileSettingsScreen />;
            case 'dashboard':
            default:
                return <BuyerDashboard role={UserRole.WHOLESALER} onSelectProduct={handleSelectProduct} />;
        }
    };

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            {!selectedProductId && <h2 className="text-3xl font-bold text-primary mb-6">Wholesaler Control Panel</h2>}
            {renderContent()}
        </DashboardLayout>
    );
};

export default WholesalerDashboard;