
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Product, Order, OrderStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { PlusCircleIcon } from '../../components/icons';
import { mockApi } from '../../services/mockApi';

// Define component here to avoid re-declaration on re-renders
const OrderCard: React.FC<{ order: Order; onUpdateStatus: (orderId: string, status: OrderStatus) => void; }> = ({ order, onUpdateStatus }) => {
    const { users, products } = useAppContext();
    const buyer = users.find(u => u.userId === order.buyerId);
    const product = products.find(p => p.productId === order.productId);

    return (
        <Card className="mb-4">
            <div className="p-4">
                <h4 className="font-bold text-lg text-primary">{product?.productName}</h4>
                <p>Buyer: {buyer?.businessName}</p>
                <p>Quantity: {order.quantity} kg</p>
                <p>Total: {order.totalPrice} DH</p>
                <p>Status: <span className="font-semibold">{order.orderStatus}</span></p>
            </div>
            {order.orderStatus === OrderStatus.PENDING && (
                 <div className="p-4 bg-gray-50 border-t flex space-x-2">
                    <Button variant="accent" onClick={() => onUpdateStatus(order.orderId, OrderStatus.CONFIRMED)}>Confirm</Button>
                    <Button variant="secondary" onClick={() => onUpdateStatus(order.orderId, OrderStatus.CANCELLED)}>Cancel</Button>
                </div>
            )}
        </Card>
    );
}

const ProductForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addProduct, currentUser } = useAppContext();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [wsPrice, setWsPrice] = useState('');
    const [rPrice, setRPrice] = useState('');
    const [stock, setStock] = useState('');
    const [minOrder, setMinOrder] = useState('');
    const [desc, setDesc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser) return;

        await addProduct({
            productName: name,
            category: category,
            wholesalePrice: parseFloat(wsPrice),
            retailPrice: parseFloat(rPrice),
            stockQuantity: parseInt(stock),
            minimumOrderQuantity: parseInt(minOrder),
            description: desc,
            photos: [`https://picsum.photos/seed/${name.replace(/\s/g, '')}/800/600`],
            farmerId: currentUser.userId,
            productLocation: currentUser.address,
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Dairy</option>
            </select>
            <input type="number" placeholder="Wholesale Price (DH)" value={wsPrice} onChange={e => setWsPrice(e.target.value)} className="w-full p-2 border rounded" required/>
            <input type="number" placeholder="Retail Price (DH)" value={rPrice} onChange={e => setRPrice(e.target.value)} className="w-full p-2 border rounded" required/>
            <input type="number" placeholder="Stock Quantity (kg)" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-2 border rounded" required/>
            <input type="number" placeholder="Min Order Qty (kg)" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="w-full p-2 border rounded" required/>
            <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded" rows={3} required></textarea>
            <Button type="submit">Add Product</Button>
        </form>
    );
}


const FarmerDashboard: React.FC = () => {
    const { currentUser, updateOrderStatus, refreshData } = useAppContext();
    const [myProducts, setMyProducts] = useState<Product[]>([]);
    const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser) {
            mockApi.getProductsByFarmer(currentUser.userId).then(setMyProducts);
            mockApi.getOrdersForSeller(currentUser.userId).then(orders => setIncomingOrders(orders.filter(o => o.orderStatus !== OrderStatus.COMPLETED && o.orderStatus !== OrderStatus.CANCELLED)));
        }
    }, [currentUser, refreshData]);

    const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
        await updateOrderStatus(orderId, status);
        alert(`Order ${status.toLowerCase()}!`);
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-primary">Farmer Dashboard</h2>
                <Button variant="accent" onClick={() => setIsModalOpen(true)} Icon={PlusCircleIcon}>
                    Add Product
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-4">My Products</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {myProducts.length > 0 ? myProducts.map(p => (
                             <Card key={p.productId}>
                                <div className="p-4">
                                    <h4 className="font-bold text-lg">{p.productName}</h4>
                                    <p>Stock: {p.stockQuantity} kg</p>
                                    <p>Wholesale: {p.wholesalePrice} DH | Retail: {p.retailPrice} DH</p>
                                </div>
                            </Card>
                        )) : <p>You have not added any products yet.</p>}
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-4">Incoming Orders</h3>
                     <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {incomingOrders.length > 0 ? incomingOrders.map(o => (
                            <OrderCard key={o.orderId} order={o} onUpdateStatus={handleUpdateStatus} />
                        )) : <p>No incoming orders.</p>}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
                <ProductForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default FarmerDashboard;
