
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Product, OrderType, SubscriptionStatus } from '../types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { PhoneIcon, WhatsAppIcon, ChevronLeftIcon, BoxIcon, MapPinIcon, ShoppingCartIcon } from '../components/icons';
import { useTranslations } from '../hooks/useTranslations';

const AddToCartForm: React.FC<{product: Product, orderType: OrderType, onClose: () => void}> = ({ product, orderType, onClose }) => {
    const { currentStore, addToCart } = useAppContext();
    const t = useTranslations();
    
    const [quantity, setQuantity] = useState(orderType === OrderType.WHOLESALE ? product.minimumOrderQuantity : 1);
    
    const price = orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;
    const minQty = orderType === OrderType.WHOLESALE ? product.minimumOrderQuantity : 1;
    const isExpired = currentStore?.subscriptionStatus === SubscriptionStatus.EXPIRED;

    const handleAddToCart = () => {
        if (isExpired) {
            alert(t('subscriptionExpiredError'));
            return;
        }
        if (quantity < minQty) {
            alert(t('minOrderError', { minQty: minQty.toString() }));
            return;
        }
        if (quantity > product.stockQuantity) {
            alert(t('stockError', { stock: product.stockQuantity.toString() }));
            return;
        }
        addToCart(product.productId, quantity);
        alert(t('addedToCart', { quantity: quantity.toString(), productName: product.productName }));
        onClose();
    }
    
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="quantity" className="block font-semibold mb-1">{t('quantity')} (kg)</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                    min={minQty}
                    max={product.stockQuantity}
                    className="w-full p-2 border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">Min: {minQty} kg</p>
            </div>
            <div className="text-2xl font-bold text-end">
                {t('total')}: <span className="text-accent">{(quantity * price).toFixed(2)} {t('currency')}</span>
            </div>
            <Button onClick={handleAddToCart} disabled={isExpired} Icon={ShoppingCartIcon}>{t('addToCart')}</Button>
        </div>
    )
}

interface ProductDetailScreenProps {
    productId: string;
    onBack: () => void;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ productId, onBack }) => {
    const { products, stores, currentStore, users } = useAppContext();
    const t = useTranslations();
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    
    const product = products.find(p => p.productId === productId);
    const farmerStore = product ? stores.find(s => s.storeId === product.storeId) : null;
    const farmerUser = farmerStore ? users.find(u => u.userId === farmerStore.userId) : null;

    if (!product || !farmerStore || !currentStore || !farmerUser) {
        return <div className="p-8">Product not found. <button onClick={onBack}>Go back</button></div>;
    }

    const orderType = currentStore.storeType === 'Wholesaler' ? OrderType.WHOLESALE : OrderType.RETAIL;
    const price = orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;
    const isExpired = currentStore?.subscriptionStatus === SubscriptionStatus.EXPIRED;

    return (
        <div className="p-4 md:p-8">
            <button onClick={onBack} className="flex items-center space-x-2 rtl:space-x-reverse text-primary font-semibold mb-6 hover:underline">
                <ChevronLeftIcon className="w-5 h-5"/>
                <span>{t('backToProducts')}</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <img src={product.photos[0]} alt={product.productName} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-primary mb-2">{product.productName}</h1>
                    <p className="text-lg text-gray-500 mb-4">{product.category}</p>
                    <p className="text-4xl font-black text-accent mb-4">{price.toFixed(2)} <span className="text-xl font-normal text-gray-600">{t('currency')} / kg</span></p>
                    
                    <div className="flex space-x-6 rtl:space-x-reverse text-lg text-gray-700 mb-6">
                        <div className="flex items-center"><BoxIcon className="w-6 h-6 me-2 text-primary"/><span>{t('stock')}: {product.stockQuantity} kg</span></div>
                        <div className="flex items-center"><MapPinIcon className="w-6 h-6 me-2 text-primary"/><span>{t('from')}: {product.productLocation}</span></div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    
                    <div className="bg-secondary p-4 rounded-lg mb-6">
                        <h3 className="font-bold text-xl text-primary mb-2">{t('farmerInfo')}</h3>
                        <p className="font-semibold">{farmerStore.storeName}</p>
                        <p>{farmerUser.fullName}</p>
                        <div className="flex space-x-4 rtl:space-x-reverse mt-2">
                           <a href={`tel:${farmerUser.phone}`} className="flex items-center space-x-2 rtl:space-x-reverse bg-white p-2 rounded-md hover:bg-gray-100 transition"><PhoneIcon className="w-5 h-5 text-blue-600"/><span>{t('call')}</span></a>
                           <a href={farmerStore.whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 rtl:space-x-reverse bg-white p-2 rounded-md hover:bg-gray-100 transition"><WhatsAppIcon className="w-5 h-5 text-green-500"/><span>WhatsApp</span></a>
                        </div>
                    </div>

                    <Button onClick={() => setOrderModalOpen(true)} disabled={isExpired} Icon={ShoppingCartIcon}>{t('addToCart')}</Button>
                </div>
            </div>

            <Modal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} title={`${t('addToCart')}: ${product.productName}`}>
                <AddToCartForm product={product} orderType={orderType} onClose={() => setOrderModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ProductDetailScreen;
