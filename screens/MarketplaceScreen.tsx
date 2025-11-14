
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { Store, UserRole } from '../types';
import Card from '../components/common/Card';
import { AgricultureIcon } from '../components/icons';

const StoreCard: React.FC<{ store: Store }> = ({ store }) => {
    const { setViewedStoreId } = useAppContext();
    const Icon = store.storeLogo ? () => <img src={store.storeLogo} alt={`${store.storeName} logo`} className="w-full h-full object-contain" /> : AgricultureIcon;
    
    return (
        <Card onClick={() => setViewedStoreId(store.storeId)} className="cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 text-center">
                 <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Icon className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-primary">{store.storeName}</h3>
                <p className="text-gray-600">{store.storeType}</p>
                <p className="text-sm text-gray-500 mt-1">{store.wilaya}</p>
            </div>
        </Card>
    );
};

const MarketplaceScreen: React.FC = () => {
    const { stores } = useAppContext();
    const t = useTranslations();
    
    // Filter out admin and potentially other non-public stores
    const publicStores = stores.filter(s => s.storeType !== UserRole.ADMIN);

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">{t('marketplace')}</h1>
                    <p className="text-lg text-gray-700">{t('browseAllStores')}</p>
                </div>
                {publicStores.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {publicStores.map(store => (
                            <StoreCard key={store.storeId} store={store} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white p-10 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-800">{t('noStoresAvailable')}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceScreen;