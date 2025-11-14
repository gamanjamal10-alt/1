
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { Product, UserRole, OrderType, User } from '../../../types';
import Card from '../../../components/common/Card';
import { SearchIcon, MapPinIcon, BoxIcon } from '../../../components/icons';
import { useTranslations } from '../../../hooks/useTranslations';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

const AddToCartForm: React.FC<{product: Product, orderType: OrderType, onClose: () => void}> = ({ product, orderType, onClose }) => {
    const { addToCart } = useAppContext();
    const t = useTranslations();
    const [quantity, setQuantity] = useState(orderType === OrderType.WHOLESALE ? product.minimumOrderQuantity : 1);
    const minQty = orderType === OrderType.WHOLESALE ? product.minimumOrderQuantity : 1;

    const handleAddToCart = () => {
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
            <Button onClick={handleAddToCart}>{t('addToCart')}</Button>
        </div>
    )
}


const ProductCard: React.FC<{ product: Product; orderType: OrderType }> = ({ product, orderType }) => {
    const { stores } = useAppContext();
    const t = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const farmerStore = stores.find(s => s.storeId === product.storeId);
    const price = orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;

    return (
        <>
            <Card className="flex flex-col">
                <img src={product.photos[0]} alt={product.productName} className="w-full h-48 object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-primary">{product.productName}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                    <p className="text-2xl font-black text-accent mb-2">{price} <span className="text-base font-normal text-gray-600">{t('currency')} / kg</span></p>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                        <BoxIcon className="w-4 h-4 me-2"/>
                        <span>{t('stock')}: {product.stockQuantity} kg</span>
                    </div>
                     <div className="flex items-center text-gray-600 text-sm">
                        <MapPinIcon className="w-4 h-4 me-2"/>
                        <span>{farmerStore?.storeName}, {product.productLocation}</span>
                    </div>
                    <Button variant="secondary" className="mt-auto !py-2" onClick={() => setIsModalOpen(true)}>{t('addToCart')}</Button>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${t('addToCart')}: ${product.productName}`}>
                <AddToCartForm product={product} orderType={orderType} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
}

interface BuyerMarketplaceProps {
    role: UserRole.WHOLESALER | UserRole.RETAILER;
    onSelectProduct: (productId: string) => void;
}

const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({ role, onSelectProduct }) => {
    const { products } = useAppContext();
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const orderType = role === UserRole.WHOLESALER ? OrderType.WHOLESALE : OrderType.RETAIL;

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);
    
    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('marketplace')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative md:col-span-2">
                     <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 ps-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <SearchIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.productId} product={product} orderType={orderType} />
                ))}
            </div>
        </div>
    );
};

export default BuyerMarketplace;
