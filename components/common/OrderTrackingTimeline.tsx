
import React from 'react';
import { Order, ShippingRequest, OrderStatus, ShippingStatus } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import { useAppContext } from '../../hooks/useAppContext';
// FIX: Imported missing XCircleIcon.
import { CheckCircleIcon, ClockIcon, PackageIcon, ClipboardListIcon, TruckIcon, XCircleIcon } from '../icons';

interface OrderTrackingTimelineProps {
  order: Order;
  shippingRequest?: ShippingRequest | null;
}

const TimelineStep: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  description?: string;
  isCompleted: boolean;
  isLast?: boolean;
}> = ({ icon: Icon, title, description, isCompleted, isLast = false }) => {
  const iconColor = isCompleted ? 'text-white bg-accent' : 'text-gray-500 bg-gray-200';
  const textColor = isCompleted ? 'text-gray-800' : 'text-gray-500';

  return (
    <li className="relative flex items-start">
      {!isLast && (
        <div className={`absolute left-4 top-5 h-full w-0.5 ${isCompleted ? 'bg-accent' : 'bg-gray-200'}`} aria-hidden="true"></div>
      )}
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconColor} z-10`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="ms-4">
        <h4 className={`text-md font-semibold ${textColor}`}>{title}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </li>
  );
};

const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ order, shippingRequest }) => {
  const { stores } = useAppContext();
  const t = useTranslations();
  
  const transportStore = shippingRequest?.transportStoreId ? stores.find(s => s.storeId === shippingRequest.transportStoreId) : null;

  const steps = [
    {
      icon: PackageIcon,
      title: t('orderPlaced'),
      description: order.date,
      isCompleted: true, // Always completed if we are tracking it
    },
    {
      icon: CheckCircleIcon,
      title: t('orderConfirmedBySeller'),
      isCompleted: order.orderStatus === OrderStatus.CONFIRMED || order.orderStatus === OrderStatus.COMPLETED,
    },
    {
      icon: ClipboardListIcon,
      title: t('shippingRequestCreated'),
      isCompleted: !!shippingRequest,
    },
    {
      icon: TruckIcon,
      title: t('driverAssigned'),
      description: transportStore?.storeName,
      isCompleted: !!shippingRequest && (shippingRequest.status === ShippingStatus.ACCEPTED || shippingRequest.status === ShippingStatus.ON_WAY || shippingRequest.status === ShippingStatus.DELIVERED),
    },
    {
      icon: TruckIcon,
      title: t('onTheWay'),
      isCompleted: !!shippingRequest && (shippingRequest.status === ShippingStatus.ON_WAY || shippingRequest.status === ShippingStatus.DELIVERED),
    },
    {
      icon: CheckCircleIcon,
      title: t('delivered'),
      isCompleted: !!shippingRequest && shippingRequest.status === ShippingStatus.DELIVERED,
    },
  ];
  
  if (order.orderStatus === OrderStatus.CANCELLED) {
      return (
          <div className="p-4 text-center">
              <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-2" />
              {/* FIX: Corrected translation key from 'Cancelled' to 'cancel' to match the translations file. */}
              <p className="text-lg font-semibold text-red-700">{t('status')}: {t('cancel')}</p>
          </div>
      )
  }

  return (
    <div className="p-2">
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <TimelineStep key={index} {...step} isLast={index === steps.length - 1} />
        ))}
      </ol>
    </div>
  );
};

export default OrderTrackingTimeline;
