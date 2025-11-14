
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import DashboardLayout from '../../components/common/DashboardLayout';
import BuyerDashboard from './BuyerDashboard';
import ProductDetailScreen from '../ProductDetailScreen';
import MyOrdersScreen from '../MyOrdersScreen';
import ProfileSettingsScreen from '../ProfileSettingsScreen';
import SubscriptionScreen from '../SubscriptionScreen';
import { DashboardIcon, CartIcon, HistoryIcon, SettingsIcon } from '../../components/icons';

const WholesalerDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const t = useTranslations();

    const navItems = [
        { label: 'wholesaleOffers', view: 'dashboard', icon: DashboardIcon },
        { label: 'myOrders', view: 'orders', icon: CartIcon },
        { label: 'orderHistory', view: 'history', icon: HistoryIcon },
        { label: 'storeSettings', view: 'settings', icon: SettingsIcon },
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
                return <ProfileSettingsScreen setActiveView={setActiveView} />;
            case 'subscription':
                return <SubscriptionScreen />;
            case 'dashboard':
            default:
                return <BuyerDashboard role={UserRole.WHOLESALER} onSelectProduct={handleSelectProduct} />;
        }
    };

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            {!selectedProductId && <h2 className="text-3xl font-bold text-primary mb-6">{t('wholesalerControlPanel')}</h2>}
            {renderContent()}
        </DashboardLayout>
    );
};

export default WholesalerDashboard;