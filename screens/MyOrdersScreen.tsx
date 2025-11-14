
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Order, OrderStatus, ShippingRequest, ShippingStatus } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { CalendarIcon, CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '../components/icons';
import { useTranslations } from '../hooks/useTranslations';
import OrderTrackingTimeline from '../components/common/OrderTrackingTimeline';

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


const OrderItem: React.FC<{ order: Order, onTrackClick: (order: Order) => void }> = ({ order, onTrackClick }) => {
    const { products, stores, createShippingRequest, shippingRequests } = useAppContext();
    const t = useTranslations();
    
    const product = products.find(p => p.productId === order.productId);
    const sellerStore = stores.find(s => s.storeId === order.sellerStoreId);
    
    const shippingRequest = useMemo(() => 
        shippingRequests.find(sr => sr.orderId === order.orderId), 
    [shippingRequests, order.orderId]);

    const handleRequestShipping = async () => {
        if (!sellerStore || !order.buyerStoreId) return;
        await createShippingRequest({
            orderId: order.orderId,
            pickupAddress: sellerStore.address,
            deliveryAddress: order.customerAddress,
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
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <span className="font-semibold">{order.orderStatus}</span>
                         <StatusIcon status={order.orderStatus} />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 text-gray-700">
                    <p>{t('quantity')}: {order.quantity} kg | {t('total')}: {order.totalPrice} {t('currency')}</p>
                    <div className="flex items-center text-sm">
                        <CalendarIcon className="w-4 h-4 me-1"/>
                        <span>{order.date}</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex space-x-2">
                    <Button variant="secondary" className="!py-2" onClick={() => onTrackClick(order)}>{t('trackOrder')}</Button>
                    {order.orderStatus === OrderStatus.CONFIRMED && !shippingRequest && (
                        <Button variant="accent" className="!py-2" onClick={handleRequestShipping}>{t('sendDeliveryRequest')}</Button>
                    )}
                </div>

            </div>
        </Card>
    );
};

interface MyOrdersScreenProps {
  orderFilter: 'active' | 'history';
}

const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({ orderFilter }) => {
    const { currentStore, orders, shippingRequests } = useAppContext();
    const t = useTranslations();
    const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

    const myOrders = useMemo(() => {
        if (!currentStore) return [];
        return orders
            .filter(o => o.buyerStoreId === currentStore.storeId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [currentStore, orders]);

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
                    filteredOrders.map(order => <OrderItem key={order.orderId} order={order} onTrackClick={setTrackingOrder} />)
                ) : (
                    <p>{emptyMessage}</p>
                )}
            </div>
            <Modal isOpen={!!trackingOrder} onClose={() => setTrackingOrder(null)} title={t('orderTracking')}>
                {trackingOrder && <OrderTrackingTimeline order={trackingOrder} shippingRequest={shippingRequests.find(sr => sr.orderId === trackingOrder.orderId)} />}
            </Modal>
        </div>
    );
};

export default MyOrdersScreen;
