import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { useTranslations } from '../../../hooks/useTranslations';
import { Product, OrderType, PaymentMethod } from '../../../types';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { TrashIcon } from '../../../components/icons';
import Modal from '../../../components/common/Modal';
import { algerianWilayas } from '../../../utils/wilayas';

const CheckoutForm: React.FC<{onClose: () => void, total: number}> = ({ onClose, total }) => {
    const { currentUser, currentStore, placeOrders } = useAppContext();
    const t = useTranslations();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    // FIX: Updated state keys to match the `Order` type properties for checkout.
    const [checkoutDetails, setCheckoutDetails] = useState({
        customerFullName: currentUser?.fullName || '',
        customerPhone: currentUser?.phone || '',
        customerWilaya: currentStore?.wilaya || '',
        customerAddress: currentStore?.address || '',
        paymentMethod: PaymentMethod.COD
    });
     const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setCheckoutDetails({ ...checkoutDetails, [e.target.name]: e.target.value });
    };
    const handlePlaceOrders = async () => {
        setIsPlacingOrder(true);
        try {
            await placeOrders(checkoutDetails);
            alert(t('orderSuccess'));
            onClose();
        } catch(error) {
            alert(`${t('orderError')}: ${error}`);
        } finally {
            setIsPlacingOrder(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* FIX: Updated form field names to match the new state keys. */}
            <input type="text" name="customerFullName" placeholder={t('fullName')} value={checkoutDetails.customerFullName} onChange={handleDetailsChange} className="w-full p-2 border rounded" required />
            <input type="tel" name="customerPhone" placeholder={t('phone')} value={checkoutDetails.customerPhone} onChange={handleDetailsChange} className="w-full p-2 border rounded" required />
            <select name="customerWilaya" value={checkoutDetails.customerWilaya} onChange={handleDetailsChange} required className="w-full p-2 border rounded">
                <option value="" disabled>{t('wilaya')}</option>
                {algerianWilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <textarea name="customerAddress" placeholder={t('fullAddress')} value={checkoutDetails.customerAddress} onChange={handleDetailsChange} className="w-full p-2 border rounded" rows={2} required></textarea>
            
            <div>
                 <label className="block font-semibold mb-1">{t('paymentMethod')}</label>
                 <select name="paymentMethod" value={checkoutDetails.paymentMethod} onChange={handleDetailsChange} className="w-full p-2 border rounded">
                    <option value={PaymentMethod.COD}>{t('cashondelivery')}</option>
                    <option value={PaymentMethod.BARIDIMOB}>{t('baridimob')}</option>
                    <option value={PaymentMethod.CCP}>{t('ccp')}</option>
                 </select>
            </div>
            
            <div className="text-2xl font-bold text-end">
                {t('total')}: <span className="text-accent">{total.toFixed(2)} {t('currency')}</span>
            </div>
            <div className="flex space-x-2">
                <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
                <Button onClick={handlePlaceOrders} disabled={isPlacingOrder}>{isPlacingOrder ? '...' : t('placeOrders')}</Button>
            </div>
        </div>
    )
}

const CartScreen: React.FC = () => {
    const { cart, products, currentStore, updateCartQuantity, removeFromCart } = useAppContext();
    const t = useTranslations();
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);

    const cartWithDetails = useMemo(() => {
        return cart.map(item => {
            const product = products.find(p => p.productId === item.productId);
            return { ...item, product };
        }).filter(item => item.product); // Filter out items where product not found
    }, [cart, products]);

    const orderType = currentStore?.storeType === 'Wholesaler' ? OrderType.WHOLESALE : OrderType.RETAIL;

    const cartTotal = useMemo(() => {
        return cartWithDetails.reduce((total, item) => {
            const price = orderType === OrderType.WHOLESALE ? item.product!.wholesalePrice : item.product!.retailPrice;
            return total + (price * item.quantity);
        }, 0);
    }, [cartWithDetails, orderType]);

    if (cart.length === 0) {
        return (
            <div className="text-center p-10">
                <h2 className="text-3xl font-bold text-primary mb-4">{t('yourCartIsEmpty')}</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any products yet.</p>
                {/* This button needs a way to navigate. For now, it's a placeholder. */}
                {/* <Button onClick={() => {}}>{t('browseProducts')}</Button> */}
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('shoppingCart')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    {cartWithDetails.map(({ product, quantity }) => (
                        product && (
                        <Card key={product.productId}>
                            <div className="p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <img src={product.photos[0]} alt={product.productName} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-primary">{product.productName}</h3>
                                    <p className="text-gray-600">{
                                        (orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice).toFixed(2)
                                    } {t('currency')}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="number" 
                                        value={quantity}
                                        onChange={(e) => updateCartQuantity(product.productId, parseInt(e.target.value) || 0)}
                                        min="1"
                                        max={product.stockQuantity}
                                        className="w-20 p-2 border rounded"
                                        aria-label={t('quantity')}
                                    />
                                    <button onClick={() => removeFromCart(product.productId)} aria-label={t('removeFromCart')}>
                                        <TrashIcon className="w-6 h-6 text-red-500 hover:text-red-700" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                        )
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <div className="p-6">
                            {/* FIX: Used a valid translation key that was added to translations.ts. */}
                            <h3 className="text-xl font-bold text-primary mb-4">{t('orderSummary')}</h3>
                            <div className="flex justify-between text-lg">
                                <span>{t('total')}</span>
                                <span className="font-bold">{cartTotal.toFixed(2)} {t('currency')}</span>
                            </div>
                            <Button onClick={() => setCheckoutOpen(true)} className="mt-6">{t('proceedToCheckout')}</Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isCheckoutOpen} onClose={() => setCheckoutOpen(false)} title={t('checkout')}>
                <CheckoutForm onClose={() => setCheckoutOpen(false)} total={cartTotal} />
            </Modal>
        </div>
    );
};

export default CartScreen;