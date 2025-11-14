import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';
import { Product, Order, OrderStatus, SubscriptionStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { PlusCircleIcon, EditIcon, BoxIcon, CartIcon, SettingsIcon, DashboardIcon, HistoryIcon } from '../../components/icons';
import { mockApi } from '../../services/mockApi';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProfileSettingsScreen from '../ProfileSettingsScreen';
import SubscriptionScreen from '../SubscriptionScreen';

const ProductForm: React.FC<{ onClose: () => void; productToEdit?: Product | null }> = ({ onClose, productToEdit }) => {
    const { addProduct, updateProduct, currentStore } = useAppContext();
    const t = useTranslations();
    const [formData, setFormData] = useState({
        name: productToEdit?.productName || '',
        category: productToEdit?.category || 'Vegetables',
        wsPrice: productToEdit?.wholesalePrice.toString() || '',
        rPrice: productToEdit?.retailPrice.toString() || '',
        minOrder: productToEdit?.minimumOrderQuantity.toString() || '',
        desc: productToEdit?.description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentStore) return;

        const productData = {
            productName: formData.name,
            category: formData.category,
            wholesalePrice: parseFloat(formData.wsPrice),
            retailPrice: parseFloat(formData.rPrice),
            minimumOrderQuantity: parseInt(formData.minOrder),
            description: formData.desc,
            stockQuantity: productToEdit?.stockQuantity || 0, // Stock is managed separately
            photos: productToEdit?.photos || [`https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/800/600`],
            storeId: currentStore.storeId,
            productLocation: currentStore.address,
        };

        if (productToEdit) {
            await updateProduct(productToEdit.productId, productData);
        } else {
            await addProduct(productData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder={t('productName')} value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                <option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Dairy</option>
            </select>
            <input type="number" name="wsPrice" placeholder={t('wholesalePrice')} value={formData.wsPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="rPrice" placeholder={t('retailPrice')} value={formData.rPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="minOrder" placeholder={t('minOrderQty')} value={formData.minOrder} onChange={handleChange} className="w-full p-2 border rounded" required />
            <textarea name="desc" placeholder={t('description')} value={formData.desc} onChange={handleChange} className="w-full p-2 border rounded" rows={3} required></textarea>
            <Button type="submit">{productToEdit ? t('updateProduct') : t('addProduct')}</Button>
        </form>
    );
};

const RetailerDashboard: React.FC = () => {
    const { currentStore, updateOrderStatus, refreshData, products, orders: allOrders, userStores } = useAppContext();
    const t = useTranslations();
    const [activeView, setActiveView] = useState('dashboard');
    const [myProducts, setMyProducts] = useState<Product[]>([]);
    const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const isExpired = currentStore?.subscriptionStatus === SubscriptionStatus.EXPIRED;

    useEffect(() => {
        if (currentStore) {
            mockApi.getProductsByStore(currentStore.storeId).then(setMyProducts);
            mockApi.getOrdersForSellerStore(currentStore.storeId).then(setIncomingOrders);
        }
    }, [currentStore, refreshData]);

    const navItems = [
        { label: 'dashboard', view: 'dashboard', icon: DashboardIcon },
        { label: 'myProducts', view: 'products', icon: BoxIcon },
        { label: 'myOrders', view: 'orders', icon: CartIcon },
        { label: 'orderHistory', view: 'history', icon: HistoryIcon },
        { label: 'storeSettings', view: 'settings', icon: SettingsIcon },
    ];
    
    const activeOrders = incomingOrders.filter(o => o.orderStatus === OrderStatus.PENDING || o.orderStatus === OrderStatus.CONFIRMED);

    const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
        if (isExpired) {
            alert(t('subscriptionExpiredError'));
            return;
        }
        await updateOrderStatus(orderId, status);
        alert(`Order ${status.toLowerCase()}!`);
    }
    
    const renderView = () => {
        switch (activeView) {
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-primary">{t('myProducts')}</h3>
                            <Button variant="accent" onClick={() => { setSelectedProduct(null); setModal('add')}} Icon={PlusCircleIcon} disabled={isExpired}>{t('addProduct')}</Button>
                        </div>
                        <div className="space-y-4">
                            {myProducts.map(p => (
                                <Card key={p.productId}>
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-lg">{p.productName}</h4>
                                            <p>{t('stock')}: {p.stockQuantity} kg</p>
                                        </div>
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <Button variant="secondary" className="w-auto" onClick={() => {setSelectedProduct(p); setModal('edit')}} Icon={EditIcon} disabled={isExpired}></Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'orders':
                 return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">{t('incomingOrders')}</h3>
                         <div className="space-y-4">
                            {activeOrders.map(o => {
                                const buyerStore = userStores.find(s => s.storeId === o.buyerStoreId);
                                return (
                                <Card key={o.orderId}>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg text-primary">{products.find(p=>p.productId === o.productId)?.productName}</h4>
                                        <p>{t('buyer')}: {buyerStore?.storeName}</p>
                                        <p>{t('status')}: <span className="font-semibold">{o.orderStatus}</span></p>
                                    </div>
                                    {o.orderStatus === OrderStatus.PENDING && (
                                        <div className="p-4 bg-gray-50 border-t flex space-x-2 rtl:space-x-reverse">
                                            <Button variant="accent" onClick={() => handleUpdateStatus(o.orderId, OrderStatus.CONFIRMED)} disabled={isExpired}>{t('confirm')}</Button>
                                            <Button variant="secondary" onClick={() => handleUpdateStatus(o.orderId, OrderStatus.CANCELLED)} disabled={isExpired}>{t('cancel')}</Button>
                                        </div>
                                    )}
                                </Card>
                            )})}
                        </div>
                    </div>
                );
            case 'history':
                const orderHistory = incomingOrders.filter(o => o.orderStatus === OrderStatus.COMPLETED || o.orderStatus === OrderStatus.CANCELLED);
                return (
                     <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">{t('orderHistory')}</h3>
                         <div className="space-y-4">
                            {orderHistory.map(o => {
                                const buyerStore = userStores.find(s => s.storeId === o.buyerStoreId);
                                return (
                                <Card key={o.orderId}>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg text-primary">{products.find(p=>p.productId === o.productId)?.productName}</h4>
                                        <p>{t('buyer')}: {buyerStore?.storeName}</p>
                                        <p>{t('status')}: <span className="font-semibold">{o.orderStatus}</span></p>
                                    </div>
                                </Card>
                            )})}
                        </div>
                    </div>
                )
            case 'settings':
                return <ProfileSettingsScreen setActiveView={setActiveView} />;
            case 'subscription':
                return <SubscriptionScreen />;
            default: // dashboard
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">{t('products')}</h3>
                            <p className="text-5xl font-extrabold">{myProducts.length}</p>
                            <p className="text-gray-500">{t('totalProductsListed')}</p>
                        </Card>
                         <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">{t('pendingOrders')}</h3>
                            <p className="text-5xl font-extrabold text-accent">{activeOrders.length}</p>
                            <p className="text-gray-500">{t('ordersRequiringAction')}</p>
                        </Card>
                    </div>
                );
        }
    }

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('retailerControlPanel')}</h2>
            {renderView()}
            <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'edit' ? t('editProduct') : t('addNewProduct')}>
                <ProductForm onClose={() => setModal(null)} productToEdit={selectedProduct} />
            </Modal>
        </DashboardLayout>
    );
};

export default RetailerDashboard;
