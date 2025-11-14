
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Product, OrderType, User, OrderStatus } from '../types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { PhoneIcon, WhatsAppIcon, ChevronLeftIcon, BoxIcon, MapPinIcon } from '../components/icons';

const OrderForm: React.FC<{product: Product, orderType: OrderType, onClose: () => void}> = ({ product, orderType, onClose }) => {
    const { currentUser, placeOrder } = useAppContext();
    const [quantity, setQuantity] = useState(orderType === OrderType.WHOLESALE ? product.minimumOrderQuantity : 1);
    const [notes, setNotes] = useState('');
    
    const price = orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;
    const minQty = orderType === OrderType.WHOLESALE ? product.minimumOrderQuantity : 1;

    const handlePlaceOrder = async () => {
        if (!currentUser) {
            alert("You must be logged in to place an order.");
            return;
        }
        if (quantity < minQty) {
            alert(`Minimum order quantity is ${minQty} kg.`);
            return;
        }
        if (quantity > product.stockQuantity) {
            alert(`Only ${product.stockQuantity} kg available in stock.`);
            return;
        }

        try {
            await placeOrder({
                productId: product.productId,
                buyerId: currentUser.userId,
                sellerId: product.farmerId,
                orderType,
                quantity,
                notes,
            });
            alert("Order placed successfully! The farmer will be notified.");
            onClose();
        } catch(error) {
            alert(`Failed to place order: ${error}`);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="quantity" className="block font-semibold mb-1">Quantity (kg)</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value))}
                    min={minQty}
                    max={product.stockQuantity}
                    className="w-full p-2 border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">Min: {minQty} kg</p>
            </div>
             <div>
                <label htmlFor="notes" className="block font-semibold mb-1">Notes (Optional)</label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any special requests for the farmer?"
                    className="w-full p-2 border rounded"
                ></textarea>
            </div>
            <div className="text-2xl font-bold text-right">
                Total: <span className="text-accent">{(quantity * price).toFixed(2)} DH</span>
            </div>
            <Button onClick={handlePlaceOrder}>Confirm Order</Button>
        </div>
    );
}

interface ProductDetailScreenProps {
    productId: string;
    onBack: () => void;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ productId, onBack }) => {
    const { products, users, currentUser } = useAppContext();
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    
    const product = products.find(p => p.productId === productId);
    const farmer = product ? users.find(u => u.userId === product.farmerId) : null;

    if (!product || !farmer || !currentUser) {
        return <div className="p-8">Product not found. <button onClick={onBack}>Go back</button></div>;
    }

    const orderType = currentUser.accountType === 'Wholesaler' ? OrderType.WHOLESALE : OrderType.RETAIL;
    const price = orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;

    return (
        <div className="p-4 md:p-8">
            <button onClick={onBack} className="flex items-center space-x-2 text-primary font-semibold mb-6 hover:underline">
                <ChevronLeftIcon className="w-5 h-5"/>
                <span>Back to Products</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <img src={product.photos[0]} alt={product.productName} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-primary mb-2">{product.productName}</h1>
                    <p className="text-lg text-gray-500 mb-4">{product.category}</p>
                    <p className="text-4xl font-black text-accent mb-4">{price.toFixed(2)} <span className="text-xl font-normal text-gray-600">DH / kg</span></p>
                    
                    <div className="flex space-x-6 text-lg text-gray-700 mb-6">
                        <div className="flex items-center"><BoxIcon className="w-6 h-6 mr-2 text-primary"/><span>Stock: {product.stockQuantity} kg</span></div>
                        <div className="flex items-center"><MapPinIcon className="w-6 h-6 mr-2 text-primary"/><span>From: {product.productLocation}</span></div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    
                    <div className="bg-secondary p-4 rounded-lg mb-6">
                        <h3 className="font-bold text-xl text-primary mb-2">Farmer Information</h3>
                        <p className="font-semibold">{farmer.businessName}</p>
                        <p>{farmer.fullName}</p>
                        <div className="flex space-x-4 mt-2">
                           <a href={`tel:${farmer.phoneNumber}`} className="flex items-center space-x-2 bg-white p-2 rounded-md hover:bg-gray-100 transition"><PhoneIcon className="w-5 h-5 text-blue-600"/><span>Call</span></a>
                           <a href={farmer.whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-white p-2 rounded-md hover:bg-gray-100 transition"><WhatsAppIcon className="w-5 h-5 text-green-500"/><span>WhatsApp</span></a>
                        </div>
                    </div>

                    <Button onClick={() => setOrderModalOpen(true)}>Make Order</Button>
                </div>
            </div>

            <Modal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} title={`Order ${product.productName}`}>
                <OrderForm product={product} orderType={orderType} onClose={() => setOrderModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ProductDetailScreen;
