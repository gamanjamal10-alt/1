
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';
import { Product, Order, OrderStatus, SubscriptionStatus, Store, HelpTopic } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { PlusCircleIcon, EditIcon, BoxIcon, CartIcon, SettingsIcon, DashboardIcon, HistoryIcon, QuestionMarkCircleIcon, PhoneIcon, WhatsAppIcon, TagIcon, TrashIcon, EyeIcon } from '../../components/icons';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProfileSettingsScreen from '../ProfileSettingsScreen';
import SubscriptionScreen from '../SubscriptionScreen';

const StorePreview: React.FC<{ store: Store, products: Product[] }> = ({ store, products }) => {
    const t = useTranslations();
    return (
        <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">{store.storeName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <Card key={product.productId}>
                        <img src={product.photos[0] || 'https://picsum.photos/800/600'} alt={product.productName} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-primary">{product.productName}</h3>
                            <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                            <p className="text-2xl font-black text-accent mb-2">{product.retailPrice} <span className="text-base font-normal text-gray-600">{t('currency')} / kg</span></p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const ProductForm: React.FC<{ onClose: () => void; productToEdit?: Product | null; storeCategories: string[] }> = ({ onClose, productToEdit, storeCategories }) => {
    const { addProduct, updateProduct, currentStore } = useAppContext();
    const t = useTranslations();
    const [formData, setFormData] = useState({
        name: productToEdit?.productName || '',
        category: productToEdit?.category || (storeCategories.length > 0 ? storeCategories[0] : ''),
        wsPrice: productToEdit?.wholesalePrice.toString() || '',
        rPrice: productToEdit?.retailPrice.toString() || '',
        minOrder: productToEdit?.minimumOrderQuantity.toString() || '',
        desc: productToEdit?.description || '',
    });
    const [photos, setPhotos] = useState<string[]>(productToEdit?.photos || []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };
    
    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
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
            photos: photos.length > 0 ? photos : [`https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/800/600`],
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
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <input type="text" name="name" placeholder={t('productName')} value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                {storeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="number" name="wsPrice" placeholder={t('wholesalePrice')} value={formData.wsPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="rPrice" placeholder={t('retailPrice')} value={formData.rPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="minOrder" placeholder={t('minOrderQty')} value={formData.minOrder} onChange={handleChange} className="w-full p-2 border rounded" required />
            <textarea name="desc" placeholder={t('description')} value={formData.desc} onChange={handleChange} className="w-full p-2 border rounded" rows={3} required></textarea>
            
            <div>
                <label className="block font-semibold mb-2 text-gray-700">{t('productImages')}</label>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800"/>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img src={photo} alt="product preview" className="w-full h-24 object-cover rounded"/>
                            <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit">{productToEdit ? t('updateProduct') : t('addProduct')}</Button>
        </form>
    );
};

const StockForm: React.FC<{ product: Product; onClose: () => void; }> = ({ product, onClose }) => {
    const { updateProduct } = useAppContext();
    const t = useTranslations();
    const [newStock, setNewStock] = useState(product.stockQuantity.toString());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const stockValue = parseInt(newStock, 10);
        if (isNaN(stockValue) || stockValue < 0) {
            alert(t('invalidQuantity'));
            return;
        }

        if (window.confirm(t('confirmStockUpdate', { productName: product.productName, quantity: stockValue.toString() }))) {
            await updateProduct(product.productId, { stockQuantity: stockValue });
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <h4 className="font-bold text-lg text-primary">{product.productName}</h4>
                <p className="text-gray-600">{t('currentStock')}: {product.stockQuantity} kg</p>
            </div>
             <div>
                <label htmlFor="stock" className="block font-semibold mb-1 text-gray-700">{t('newStockQuantity')} (kg)</label>
                <input 
                    type="number"
                    id="stock"
                    value={newStock} 
                    onChange={(e) => setNewStock(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                    required 
                    min="0"
                    aria-describedby="stock-description"
                />
                 <p id="stock-description" className="text-sm text-gray-500 mt-1">Enter the total new stock quantity.</p>
            </div>
            <Button type="submit">{t('updateStock')}</Button>
        </form>
    );
};

const CategoryManagementView = () => {
    const { currentStore, updateStore } = useAppContext();
    const t = useTranslations();
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ old: string, new: string } | null>(null);

    if (!currentStore) return null;

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        if ((currentStore.categories || []).includes(newCategory.trim())) {
            alert(t('categoryExistsError'));
            return;
        }
        const updatedCategories = [...(currentStore.categories || []), newCategory.trim()];
        await updateStore(currentStore.storeId, { categories: updatedCategories });
        setNewCategory('');
        alert(t('categoryAddedSuccess'));
    };

    const handleDeleteCategory = async (categoryToDelete: string) => {
        if (window.confirm(t('deleteCategoryConfirm', { categoryName: categoryToDelete }))) {
            const updatedCategories = (currentStore.categories || []).filter(c => c !== categoryToDelete);
            await updateStore(currentStore.storeId, { categories: updatedCategories });
            alert(t('categoryDeletedSuccess'));
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory || !editingCategory.new.trim()) return;
        if (editingCategory.old !== editingCategory.new && (currentStore.categories || []).includes(editingCategory.new.trim())) {
            alert(t('categoryExistsError'));
            return;
        }
        const updatedCategories = (currentStore.categories || []).map(c => c === editingCategory.old ? editingCategory.new.trim() : c);
        await updateStore(currentStore.storeId, { categories: updatedCategories });
        setEditingCategory(null);
        alert(t('categoryUpdatedSuccess'));
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">{t('manageCategories')}</h3>
            <Card className="mb-6">
                <div className="p-4">
                    <h4 className="font-bold mb-2">{t('addCategory')}</h4>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder={t('newCategoryName')}
                            className="w-full p-2 border rounded"
                        />
                        <Button onClick={handleAddCategory}>{t('add')}</Button>
                    </div>
                </div>
            </Card>
            <div className="space-y-2">
                {(currentStore.categories || []).map(cat => (
                    <Card key={cat}>
                        <div className="p-3 flex justify-between items-center">
                            {editingCategory?.old === cat ? (
                                <input
                                    type="text"
                                    value={editingCategory.new}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <span className="font-semibold">{cat}</span>
                            )}
                            <div className="flex space-x-2">
                                {editingCategory?.old === cat ? (
                                    <>
                                        <Button onClick={handleUpdateCategory} variant="accent" className="!py-1 !px-3">{t('saveChanges')}</Button>
                                        <Button onClick={() => setEditingCategory(null)} variant="secondary" className="!py-1 !px-3">{t('cancel')}</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => setEditingCategory({ old: cat, new: cat })} variant="secondary" Icon={EditIcon} className="!py-1 !px-3"></Button>
                                        <Button onClick={() => handleDeleteCategory(cat)} className="!bg-red-600 hover:!bg-red-800 !py-1 !px-3">{t('delete')}</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const FarmerDashboard: React.FC = () => {
    const { currentStore, updateOrderStatus, products, orders, stores, showHelp, deleteProduct } = useAppContext();
    const t = useTranslations();
    const [activeView, setActiveView] = useState('dashboard');
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [modal, setModal] = useState<'add' | 'edit' | 'stock' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const isExpired = currentStore?.subscriptionStatus === SubscriptionStatus.EXPIRED;

    const myProducts = useMemo(() => 
        products.filter(p => p.storeId === currentStore?.storeId),
    [products, currentStore]);

    const incomingOrders = useMemo(() =>
        orders.filter(o => o.sellerStoreId === currentStore?.storeId),
    [orders, currentStore]);

    const navItems = [
        { label: 'dashboard', view: 'dashboard', icon: DashboardIcon },
        { label: 'myProducts', view: 'products', icon: BoxIcon },
        { label: 'myOrders', view: 'orders', icon: CartIcon },
        { label: 'manageCategories', view: 'categories', icon: TagIcon },
        { label: 'orderHistory', view: 'history', icon: HistoryIcon },
        { label: 'storeSettings', view: 'settings', icon: SettingsIcon },
    ];
    
    const activeOrders = incomingOrders.filter(o => o.orderStatus === OrderStatus.PENDING || o.orderStatus === OrderStatus.CONFIRMED);
    const orderHistory = incomingOrders.filter(o => o.orderStatus === OrderStatus.COMPLETED || o.orderStatus === OrderStatus.CANCELLED);

    const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
        if (isExpired) {
            alert(t('subscriptionExpiredError'));
            return;
        }
        await updateOrderStatus(orderId, status);
        alert(`Order ${status.toLowerCase()}!`);
    }

    const handleProductDelete = async (productId: string) => {
        if (window.confirm(t('deleteProductConfirm'))) {
            await deleteProduct(productId);
            alert("Product deleted successfully.");
        }
    };

    const getBuyerStore = (buyerStoreId: string): Store | undefined => {
        return stores.find(s => s.storeId === buyerStoreId);
    }
    
    if (isPreviewing && currentStore) {
        return (
            <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-3xl font-bold text-primary">{t('viewStore')}</h2>
                     <Button onClick={() => setIsPreviewing(false)}>{t('backToDashboard')}</Button>
                </div>
                <StorePreview store={currentStore} products={myProducts} />
            </DashboardLayout>
        );
    }

    const renderView = () => {
        switch (activeView) {
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-primary">{t('myProducts')}</h3>
                            <div className="flex items-center space-x-2">
                                <Button variant="accent" onClick={() => { setSelectedProduct(null); setModal('add')}} Icon={PlusCircleIcon} disabled={isExpired}>{t('addProduct')}</Button>
                                <button onClick={(e) => showHelp(HelpTopic.ADD_PRODUCT, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-6 h-6"/></button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {myProducts.map(p => (
                                <Card key={p.productId}>
                                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
                                        <div className="mb-4 sm:mb-0 flex-grow">
                                            <h4 className="font-bold text-lg">{p.productName}</h4>
                                            <p>{p.category} | {t('stock')}: {p.stockQuantity} kg</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:space-x-2 rtl:sm:space-x-reverse space-y-2 sm:space-y-0 w-full sm:w-auto">
                                            <div className="flex items-center space-x-1">
                                                <Button variant="secondary" className="w-full sm:w-auto text-sm !py-2" onClick={() => { setSelectedProduct(p); setModal('stock') }} Icon={BoxIcon} disabled={isExpired}>{t('manageStock')}</Button>
                                                <button onClick={(e) => showHelp(HelpTopic.MANAGE_STOCK, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-5 h-5"/></button>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button variant="secondary" className="w-full sm:w-auto text-sm !py-2" onClick={() => {setSelectedProduct(p); setModal('edit')}} Icon={EditIcon} disabled={isExpired}>{t('edit')}</Button>
                                                <button onClick={(e) => showHelp(HelpTopic.EDIT_PRODUCT, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-5 h-5"/></button>
                                            </div>
                                             <Button onClick={() => handleProductDelete(p.productId)} className="!bg-red-600 hover:!bg-red-800 !py-2" Icon={TrashIcon}></Button>
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
                                const buyerStore = getBuyerStore(o.buyerStoreId);
                                const product = products.find(p => p.productId === o.productId);
                                return (
                                <Card key={o.orderId}>
                                    <div className="p-4 space-y-2">
                                        <h4 className="font-bold text-lg text-primary">{product?.productName}</h4>
                                        <p><span className="font-semibold">{t('buyer')}:</span> {buyerStore?.storeName} ({o.customerFullName})</p>
                                        <p><span className="font-semibold">{t('address')}:</span> {o.customerAddress}, {o.customerWilaya}</p>
                                        <div>
                                            <p className="font-semibold">{t('contact')}:</p>
                                            <div className="flex items-center space-x-4 rtl:space-x-reverse mt-1">
                                                <a href={`tel:${o.customerPhone}`} className="flex items-center space-x-1 rtl:space-x-reverse text-gray-800 hover:text-primary transition">
                                                    <PhoneIcon className="w-5 h-5 text-blue-600" />
                                                    <span>{o.customerPhone}</span>
                                                </a>
                                                <a href={`https://wa.me/${o.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 rtl:space-x-reverse text-gray-800 hover:text-primary transition">
                                                    <WhatsAppIcon className="w-5 h-5 text-green-500" />
                                                    <span>WhatsApp</span>
                                                </a>
                                            </div>
                                        </div>
                                        <p><span className="font-semibold">{t('paymentMethod')}:</span> {t(o.paymentMethod.replace(/\s/g, '').toLowerCase() as any)}</p>
                                        <p><span className="font-semibold">{t('status')}:</span> <span className="font-semibold">{o.orderStatus}</span></p>
                                    </div>
                                    {o.orderStatus === OrderStatus.PENDING && (
                                        <div className="p-4 bg-gray-50 border-t flex space-x-2 rtl:space-x-reverse">
                                            <div className="flex items-center space-x-1">
                                               <Button variant="accent" onClick={() => handleUpdateStatus(o.orderId, OrderStatus.CONFIRMED)} disabled={isExpired}>{t('confirm')}</Button>
                                                <button onClick={(e) => showHelp(HelpTopic.CONFIRM_ORDER, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-5 h-5"/></button>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button variant="secondary" onClick={() => handleUpdateStatus(o.orderId, OrderStatus.CANCELLED)} disabled={isExpired}>{t('cancel')}</Button>
                                                <button onClick={(e) => showHelp(HelpTopic.CANCEL_ORDER, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )})}
                        </div>
                    </div>
                );
             case 'categories':
                return <CategoryManagementView />;
            case 'history':
                return (
                     <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">{t('orderHistory')}</h3>
                         <div className="space-y-4">
                            {orderHistory.map(o => {
                                const buyerStore = getBuyerStore(o.buyerStoreId);
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">{t('products')}</h3>
                            <p className="text-5xl font-extrabold">{myProducts.length}</p>
                            <p className="text-gray-500">{t('totalProductsListed')}</p>
                        </Card>
                         <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">{t('newOrders')}</h3>
                            <p className="text-5xl font-extrabold text-accent">{activeOrders.length}</p>
                            <p className="text-gray-500">{t('ordersRequiringAction')}</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">{t('totalOrders')}</h3>
                            <p className="text-5xl font-extrabold">{incomingOrders.length}</p>
                            <p className="text-gray-500">{t('totalOrdersReceived')}</p>
                        </Card>
                    </div>
                );
        }
    }

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-primary">
                    {activeView === 'dashboard' ? t('farmerControlPanel') : t(navItems.find(i => i.view === activeView)?.label as any)}
                </h2>
                <div>
                  {activeView !== 'dashboard' && <Button onClick={() => setActiveView('dashboard')} variant="secondary" className="w-auto me-2">{t('backToDashboard')}</Button>}
                  <Button onClick={() => setIsPreviewing(true)} variant="accent" Icon={EyeIcon} className="w-auto">{t('viewStore')}</Button>
                </div>
            </div>
            {renderView()}
            <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'edit' ? t('editProduct') : t('addNewProduct')}>
                <ProductForm onClose={() => setModal(null)} productToEdit={selectedProduct} storeCategories={currentStore?.categories || []} />
            </Modal>
            {selectedProduct && (
                 <Modal isOpen={modal === 'stock'} onClose={() => setModal(null)} title={t('manageStock')}>
                    <StockForm product={selectedProduct} onClose={() => setModal(null)} />
                </Modal>
            )}
        </DashboardLayout>
    );
};

export default FarmerDashboard;