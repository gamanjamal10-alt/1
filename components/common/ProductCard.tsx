
import React from 'react';
import { Product, OrderType, Store } from '../../types';
import Card from './Card';
import { useTranslations } from '../../hooks/useTranslations';
import { MapPinIcon, BoxIcon } from '../icons';

interface ProductCardProps {
    product: Product;
    onSelect: (productId: string) => void;
    orderType: OrderType;
    stores: Store[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, orderType, stores }) => {
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

export default ProductCard;