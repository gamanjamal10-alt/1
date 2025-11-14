
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { OrderType } from '../types';
import { ChevronLeftIcon } from '../components/icons';
import ProductCard from '../components/common/ProductCard';
import ProductDetailScreen from './ProductDetailScreen';

const StorefrontScreen: React.FC = () => {
    const { stores, products, viewedStoreId, setViewedStoreId } = useAppContext();
    const t = useTranslations();
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const store = useMemo(() => stores.find(s => s.storeId === viewedStoreId), [stores, viewedStoreId]);
    const storeProducts = useMemo(() => products.filter(p => p.storeId === viewedStoreId), [products, viewedStoreId]);
    
    if (selectedProductId) {
        return <ProductDetailScreen productId={selectedProductId} onBack={() => setSelectedProductId(null)} />
    }

    if (!store) {
        return (
            <div className="p-8 text-center">
                <p className="text-lg text-red-600">Store not found.</p>
                <button onClick={() => setViewedStoreId(null)} className="mt-4 text-primary hover:underline">Back to Marketplace</button>
            </div>
        );
    }
    
    // For storefront, we assume a "retail" perspective for pricing display, can be adjusted
    const orderType = OrderType.RETAIL;

    return (
        <div className="p-4 md:p-8">
             <button onClick={() => setViewedStoreId(null)} className="flex items-center space-x-2 rtl:space-x-reverse text-primary font-semibold mb-6 hover:underline">
                <ChevronLeftIcon className="w-5 h-5"/>
                <span>{t('backToMarketplace')}</span>
            </button>
            
            <div className="flex items-center space-x-4 mb-8">
                {store.storeLogo && <img src={store.storeLogo} alt={`${store.storeName} logo`} className="w-20 h-20 rounded-lg object-contain bg-white p-1" />}
                <div>
                    <h1 className="text-4xl font-bold text-primary">{store.storeName}</h1>
                    <p className="text-gray-600">{store.wilaya}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {storeProducts.map(product => (
                    <ProductCard key={product.productId} product={product} onSelect={setSelectedProductId} orderType={orderType} stores={stores} />
                ))}
            </div>
            {storeProducts.length === 0 && (
                <div className="text-center bg-white p-10 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-gray-800">{t('noProductsInStore')}</h2>
                </div>
            )}
        </div>
    );
};

export default StorefrontScreen;