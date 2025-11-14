
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { Store, StoreStatus, SubscriptionStatus } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { PlusCircleIcon } from '../components/icons';
import CreateStoreScreen from './CreateStoreScreen';
import Header from '../components/Header';

const StoreCard: React.FC<{ store: Store; onSelect: () => void }> = ({ store, onSelect }) => {
    const isExpired = store.subscriptionStatus === SubscriptionStatus.EXPIRED;
    return (
        <Card onClick={onSelect} className="cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <div className={`p-6 ${isExpired ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-primary">{store.storeName}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isExpired ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                    }`}>
                        {isExpired ? 'Expired' : 'Active'}
                    </span>
                </div>
                <p className="text-gray-600">{store.storeType}</p>
            </div>
        </Card>
    );
};

const StoreSelectionScreen: React.FC = () => {
    const { currentUser, userStores, selectStore } = useAppContext();
    const t = useTranslations();
    const [isCreating, setIsCreating] = useState(false);

    if (isCreating) {
        return <CreateStoreScreen onStoreCreated={() => setIsCreating(false)} />;
    }

    return (
        <div className="min-h-screen bg-secondary">
            <Header />
            <main className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-primary">{t('yourStores')}</h1>
                            <p className="text-lg text-gray-700">{t('selectStore')}</p>
                        </div>
                        {userStores.length > 0 && userStores.length < 4 && (
                            <Button
                                variant="accent"
                                onClick={() => setIsCreating(true)}
                                className="w-auto"
                                Icon={PlusCircleIcon}
                            >
                                {t('createAStore')}
                            </Button>
                        )}
                    </div>
                    {userStores.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userStores.map(store => (
                                <StoreCard key={store.storeId} store={store} onSelect={() => selectStore(store)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-10 rounded-lg shadow">
                            <h2 className="text-2xl font-semibold text-gray-800">{t('noStoresFound')}</h2>
                            <p className="text-gray-500 mt-2 mb-6">It looks like you haven't created any stores yet. Let's get your first one set up!</p>
                            <Button onClick={() => setIsCreating(true)} className="w-auto mx-auto" Icon={PlusCircleIcon}>{t('createAStore')}</Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StoreSelectionScreen;
