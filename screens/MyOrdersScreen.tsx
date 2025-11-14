
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Order, OrderStatus, ShippingRequest, ShippingStatus } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { mockApi } from '../services/mockApi';
import { CalendarIcon, CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '../components/icons';
import { useTranslations } from '../hooks/useTranslations';

const StatusIcon: React.FC<{ status: OrderStatus | ShippingStatus }> = ({ status }) => {
    switch (status) {
        case OrderStatus.PENDING:
        case ShippingStatus.WAITING:
            return <ClockIcon className="w-6 h-6 text-yellow-500" />;
        case OrderStatus.CONFIRMED:
        case ShippingStatus.ACCEPTED:
        case ShippingStatus.ON_WAY:
            return <TruckIcon className="w-6 h-6 text-blue-500" />;
        case OrderStatus.COMPLETED:
        case ShippingStatus.DELIVERED:
            return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
        case OrderStatus.CANCELLED:
        case ShippingStatus.REJECTED:
            return <XCircleIcon className="w-6 h-6 text-red-500" />;
        default:
            return null;
    }
};


const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
    const { products, userStores, createShippingRequest, refreshData } = useAppContext();
    const t = useTranslations();
    const [shippingRequest, setShippingRequest] = useState<ShippingRequest | undefined>(undefined);

    const product = products.find(p => p.productId === order.productId);
    const sellerStore = userStores.find(s => s.storeId === order.sellerStoreId);
    const buyerStore = userStores.find(s => s.storeId === order.buyerStoreId);
    
    useEffect(() => {
        mockApi.getShippingRequestByOrder(order.orderId).then(setShippingRequest);
    }, [order.orderId, refreshData]);

    const handleRequestShipping = async () => {
        if (!sellerStore || !buyerStore) return;
        await createShippingRequest({
            orderId: order.orderId,
            pickupAddress: sellerStore.address,
            deliveryAddress: buyerStore.address,
        });
        alert('Shipping request sent to all transport companies!');
    }
    
    return (
        <Card className="mb-4">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-lg text-primary">{product?.productName}</h4>
                        <p className="text-sm text-gray-600">{t('from')}: {sellerStore?.storeName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                         <span className="font-semibold">{order.orderStatus}</span>
                         <StatusIcon status={order.orderStatus} />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 text-gray-700">
                    <p>{t('quantity')}: {order.quantity} kg | {t('total')}: {order.totalPrice} DH</p>
                    <div className="flex items-center text-sm">
                        <CalendarIcon className="w-4 h-4 mr-1"/>
                        <span>{order.date}</span>
                    </div>
                </div>
                
                {order.orderStatus === OrderStatus.CONFIRMED && (
                    <div className="mt-4 pt-4 border-t">
                        {shippingRequest ? (
                             <div className="flex items-center space-x-2">
                                <StatusIcon status={shippingRequest.status} />
                                <span>{t('shipping')}: {shippingRequest.status}</span>
                                {shippingRequest.deliveryPrice && <span className="font-bold">{shippingRequest.deliveryPrice} DH</span>}
                            </div>
                        ) : (
                            <Button variant="secondary" onClick={handleRequestShipping}>{t('sendDeliveryRequest')}</Button>
                        )}
                    </div>
                )}

            </div>
        </Card>
    );
};

interface MyOrdersScreenProps {
  orderFilter: 'active' | 'history';
}

const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({ orderFilter }) => {
    const { currentStore, refreshData } = useAppContext();
    const t = useTranslations();
    const [myOrders, setMyOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (currentStore) {
            mockApi.getOrdersForBuyerStore(currentStore.storeId).then(orders => {
                setMyOrders(orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            });
        }
    }, [currentStore, refreshData]);

    const filteredOrders = useMemo(() => {
        const activeStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
        if (orderFilter === 'active') {
            return myOrders.filter(order => activeStatuses.includes(order.orderStatus));
        }
        return myOrders.filter(order => !activeStatuses.includes(order.orderStatus));
    }, [myOrders, orderFilter]);
    
    const title = orderFilter === 'active' ? t('myActiveOrders') : t('myOrderHistory');
    const emptyMessage = orderFilter === 'active' ? t('noActiveOrders') : t('noPastOrders');

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary mb-6">{title}</h2>
            <div>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => <OrderItem key={order.orderId} order={order} />)
                ) : (
                    <p>{emptyMessage}</p>
                )}
            </div>
        </div>
    );
};

export default MyOrdersScreen;
