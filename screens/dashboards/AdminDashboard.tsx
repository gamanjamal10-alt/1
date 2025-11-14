
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/common/Card';

const AdminDashboard: React.FC = () => {
    const { users, products, orders, shippingRequests } = useAppContext();
    const [activeTab, setActiveTab] = useState('users');

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                // FIX: Removed non-existent `accountType` and `businessName` properties. Displaying email instead.
                return users.map(u => <div key={u.userId} className="p-2 border-b">{u.fullName} ({u.email})</div>);
            case 'products':
                return products.map(p => <div key={p.productId} className="p-2 border-b">{p.productName} - Stock: {p.stockQuantity}kg</div>);
            case 'orders':
                return orders.map(o => <div key={o.orderId} className="p-2 border-b">Order {o.orderId.slice(-5)} - {o.orderStatus}</div>);
            case 'shipping':
                return shippingRequests.map(s => <div key={s.requestId} className="p-2 border-b">Request {s.requestId.slice(-5)} - {s.status}</div>);
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Admin Panel</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 text-center">
                    <p className="text-3xl font-bold">{users.length}</p>
                    <p>Users</p>
                </Card>
                 <Card className="p-4 text-center">
                    <p className="text-3xl font-bold">{products.length}</p>
                    <p>Products</p>
                </Card>
                 <Card className="p-4 text-center">
                    <p className="text-3xl font-bold">{orders.length}</p>
                    <p>Orders</p>
                </Card>
                 <Card className="p-4 text-center">
                    <p className="text-3xl font-bold">{shippingRequests.length}</p>
                    <p>Shipping Requests</p>
                </Card>
            </div>

            <Card>
                <div className="flex border-b">
                    <button onClick={() => setActiveTab('users')} className={`p-4 font-semibold ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : ''}`}>Users</button>
                    <button onClick={() => setActiveTab('products')} className={`p-4 font-semibold ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : ''}`}>Products</button>
                    <button onClick={() => setActiveTab('orders')} className={`p-4 font-semibold ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : ''}`}>Orders</button>
                    <button onClick={() => setActiveTab('shipping')} className={`p-4 font-semibold ${activeTab === 'shipping' ? 'text-primary border-b-2 border-primary' : ''}`}>Shipping</button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
