import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Product, UserRole, OrderType } from '../../types';
import Card from '../../components/common/Card';
import { SearchIcon, MapPinIcon, BoxIcon } from '../../components/icons';
import { useTranslations } from '../../hooks/useTranslations';

const ProductCard: React.FC<{ product: Product; onSelect: (productId: string) => void, orderType: OrderType }> = ({ product, onSelect, orderType }) => {
    const { stores } = useAppContext();
    const t = useTranslations();
    const farmerStore = stores.find(s => s.storeId === product.storeId);
    const price = orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;

    return (
        <Card className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300" onClick={() => onSelect(product.productId)}>
            <img src={product.photos[0]} alt={product.productName} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold text-primary">{product.productName}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                <p className="text-2xl font-black text-accent mb-2">{price} <span className="text-base font-normal text-gray-600">{t('currency')} / kg</span></p>
                <div className="flex items-center text-gray-600 text-sm mb-1">
                    <BoxIcon className="w-4 h-4 me-2"/>
                    <span>Stock: {product.stockQuantity} kg</span>
                </div>
                 <div className="flex items-center text-gray-600 text-sm">
                    <MapPinIcon className="w-4 h-4 me-2"/>
                    <span>{farmerStore?.storeName}, {product.productLocation}</span>
                </div>
            </div>
        </Card>
    );
}

interface BuyerDashboardProps {
    role: UserRole.WHOLESALER | UserRole.RETAILER;
    onSelectProduct: (productId: string) => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ role, onSelectProduct }) => {
    const { products } = useAppContext();
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const orderType = role === UserRole.WHOLESALER ? OrderType.WHOLESALE : OrderType.RETAIL;
    const titleKey = role === UserRole.WHOLESALER ? 'wholesalerDashboard' : 'retailerControlPanel';
    const title = t(titleKey);


    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);
    
    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-primary mb-6">{title}</h2>
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
                    <ProductCard key={product.productId} product={product} onSelect={onSelectProduct} orderType={orderType} />
                ))}
            </div>
        </div>
    );
};

export default BuyerDashboard;