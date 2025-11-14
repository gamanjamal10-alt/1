
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Product, Order, OrderStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { PlusCircleIcon, EditIcon, BoxIcon, CartIcon, SettingsIcon, DashboardIcon } from '../../components/icons';
import { mockApi } from '../../services/mockApi';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProfileSettingsScreen from '../ProfileSettingsScreen';

const ProductForm: React.FC<{ onClose: () => void; productToEdit?: Product | null }> = ({ onClose, productToEdit }) => {
    const { addProduct, updateProduct, currentUser } = useAppContext();
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
        if (!currentUser) return;

        const productData = {
            productName: formData.name,
            category: formData.category,
            wholesalePrice: parseFloat(formData.wsPrice),
            retailPrice: parseFloat(formData.rPrice),
            minimumOrderQuantity: parseInt(formData.minOrder),
            description: formData.desc,
            stockQuantity: productToEdit?.stockQuantity || 0, // Stock is managed separately
            photos: productToEdit?.photos || [`https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/800/600`],
            farmerId: currentUser.userId,
            productLocation: currentUser.address,
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
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                <option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Dairy</option>
            </select>
            <input type="number" name="wsPrice" placeholder="Wholesale Price (DH)" value={formData.wsPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="rPrice" placeholder="Retail Price (DH)" value={formData.rPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="minOrder" placeholder="Min Order Qty (kg)" value={formData.minOrder} onChange={handleChange} className="w-full p-2 border rounded" required />
            <textarea name="desc" placeholder="Description" value={formData.desc} onChange={handleChange} className="w-full p-2 border rounded" rows={3} required></textarea>
            <Button type="submit">{productToEdit ? 'Update Product' : 'Add Product'}</Button>
        </form>
    );
};

const StockForm: React.FC<{product: Product, onClose: () => void}> = ({ product, onClose }) => {
    const { updateProductStock } = useAppContext();
    const [stock, setStock] = useState(product.stockQuantity);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProductStock(product.productId, stock);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-xl font-semibold">{product.productName}</h4>
            <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} className="w-full p-2 border rounded" required />
            <Button type="submit">Update Stock</Button>
        </form>
    )
}

const FarmerDashboard: React.FC = () => {
    const { currentUser, updateOrderStatus, refreshData } = useAppContext();
    const [activeView, setActiveView] = useState('dashboard');
    const [myProducts, setMyProducts] = useState<Product[]>([]);
    const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
    const [modal, setModal] = useState<'add' | 'edit' | 'stock' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (currentUser) {
            mockApi.getProductsByFarmer(currentUser.userId).then(setMyProducts);
            mockApi.getOrdersForSeller(currentUser.userId).then(setIncomingOrders);
        }
    }, [currentUser, refreshData]);

    const navItems = [
        { label: 'Dashboard', view: 'dashboard', icon: DashboardIcon },
        { label: 'My Products', view: 'products', icon: BoxIcon },
        { label: 'My Orders', view: 'orders', icon: CartIcon },
        { label: 'Profile Settings', view: 'settings', icon: SettingsIcon },
    ];
    
    const activeOrders = incomingOrders.filter(o => o.orderStatus === OrderStatus.PENDING || o.orderStatus === OrderStatus.CONFIRMED);

    const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
        await updateOrderStatus(orderId, status);
        alert(`Order ${status.toLowerCase()}!`);
    }
    
    const renderView = () => {
        switch (activeView) {
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold text-primary">My Products</h3>
                            <Button variant="accent" onClick={() => { setSelectedProduct(null); setModal('add')}} Icon={PlusCircleIcon}>Add Product</Button>
                        </div>
                        <div className="space-y-4">
                            {myProducts.map(p => (
                                <Card key={p.productId}>
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-lg">{p.productName}</h4>
                                            <p>Stock: {p.stockQuantity} kg</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" className="w-auto" onClick={() => {setSelectedProduct(p); setModal('stock')}}>Manage Stock</Button>
                                            <Button variant="secondary" className="w-auto" onClick={() => {setSelectedProduct(p); setModal('edit')}} Icon={EditIcon}></Button>
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
                        <h3 className="text-2xl font-semibold text-primary mb-4">Incoming Orders</h3>
                         <div className="space-y-4">
                            {incomingOrders.map(o => (
                                <Card key={o.orderId}>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg text-primary">{products.find(p=>p.productId === o.productId)?.productName}</h4>
                                        <p>Buyer: {users.find(u=>u.userId === o.buyerId)?.businessName}</p>
                                        <p>Status: <span className="font-semibold">{o.orderStatus}</span></p>
                                    </div>
                                    {o.orderStatus === OrderStatus.PENDING && (
                                        <div className="p-4 bg-gray-50 border-t flex space-x-2">
                                            <Button variant="accent" onClick={() => handleUpdateStatus(o.orderId, OrderStatus.CONFIRMED)}>Confirm</Button>
                                            <Button variant="secondary" onClick={() => handleUpdateStatus(o.orderId, OrderStatus.CANCELLED)}>Cancel</Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'settings':
                return <ProfileSettingsScreen />;
            default: // dashboard
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">Products</h3>
                            <p className="text-5xl font-extrabold">{myProducts.length}</p>
                            <p className="text-gray-500">Total products listed</p>
                        </Card>
                         <Card className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">Pending Orders</h3>
                            <p className="text-5xl font-extrabold text-accent">{activeOrders.length}</p>
                            <p className="text-gray-500">New orders requiring action</p>
                        </Card>
                    </div>
                );
        }
    }

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-primary mb-6">Farmer Control Panel</h2>
            {renderView()}
            <Modal isOpen={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit Product' : 'Add New Product'}>
                <ProductForm onClose={() => setModal(null)} productToEdit={selectedProduct} />
            </Modal>
            <Modal isOpen={modal === 'stock'} onClose={() => setModal(null)} title="Update Stock">
                {selectedProduct && <StockForm product={selectedProduct} onClose={() => setModal(null)} />}
            </Modal>
        </DashboardLayout>
    );
};

export default FarmerDashboard;