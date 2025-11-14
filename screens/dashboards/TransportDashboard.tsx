
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';
import { ShippingRequest, ShippingStatus, SubscriptionStatus, HelpTopic } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MapPinIcon, TruckIcon, DashboardIcon, HistoryIcon, SettingsIcon, QuestionMarkCircleIcon } from '../../components/icons';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProfileSettingsScreen from '../ProfileSettingsScreen';
import SubscriptionScreen from '../SubscriptionScreen';

const ShippingRequestCard: React.FC<{ request: ShippingRequest, isHistory?: boolean }> = ({ request, isHistory = false }) => {
    const { currentStore, updateShippingRequest, showHelp } = useAppContext();
    const t = useTranslations();
    const isMyJob = request.transportStoreId === currentStore?.storeId;
    const isExpired = currentStore?.subscriptionStatus === SubscriptionStatus.EXPIRED;

    const handleAccept = () => {
        if (isExpired) {
             alert(t('subscriptionExpiredError'));
            return;
        }
        const priceStr = prompt(t('enterDeliveryPricePrompt', { currency: t('currency')}));
        const price = parseFloat(priceStr || '0');
        if (price > 0 && currentStore) {
            updateShippingRequest(request.requestId, ShippingStatus.ACCEPTED, currentStore.storeId, price);
            alert(t('deliveryRequestAccepted'));
        } else {
            alert(t('invalidPrice'));
        }
    };
    
    const handleUpdateStatus = (status: ShippingStatus) => {
        if (isExpired) {
             alert(t('subscriptionExpiredError'));
            return;
        }
        updateShippingRequest(request.requestId, status);
        alert(`${t('deliveryStatusUpdated')} ${status}!`);
    };

    return (
        <Card className="mb-4">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-primary mb-2">{t('delivery')} #{request.requestId.slice(-5)}</h4>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        request.status === ShippingStatus.WAITING ? 'bg-yellow-200 text-yellow-800' :
                        request.status === ShippingStatus.ACCEPTED ? 'bg-blue-200 text-blue-800' :
                        request.status === ShippingStatus.ON_WAY ? 'bg-indigo-200 text-indigo-800' :
                        request.status === ShippingStatus.DELIVERED ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                    }`}>{request.status}</span>
                </div>
                <div className="my-3 space-y-2 text-gray-700">
                     <div className="flex items-start"><MapPinIcon className="w-5 h-5 me-2 mt-1 text-accent" /><div><span className="font-semibold">{t('from')}:</span> {request.pickupAddress}</div></div>
                     <div className="flex items-start"><MapPinIcon className="w-5 h-5 me-2 mt-1 text-red-500" /><div><span className="font-semibold">{t('to')}:</span> {request.deliveryAddress}</div></div>
                </div>
                {request.deliveryPrice && <p>{t('price')}: <span className="font-bold text-lg">{request.deliveryPrice} {t('currency')}</span></p>}
            </div>
            {!isHistory && (
                 <div className="p-4 bg-gray-50 border-t">
                    {request.status === ShippingStatus.WAITING && (
                        <div className="flex items-center space-x-2">
                            <Button variant="accent" onClick={handleAccept} disabled={isExpired}>{t('acceptRequest')}</Button>
                            <button onClick={(e) => showHelp(HelpTopic.ACCEPT_REQUEST, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-6 h-6"/></button>
                        </div>
                    )}
                    {isMyJob && request.status === ShippingStatus.ACCEPTED && (
                        <div className="flex items-center space-x-2">
                            <Button onClick={() => handleUpdateStatus(ShippingStatus.ON_WAY)} Icon={TruckIcon} disabled={isExpired}>{t('startDelivery')}</Button>
                            <button onClick={(e) => showHelp(HelpTopic.START_DELIVERY, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-6 h-6"/></button>
                        </div>
                    )}
                    {isMyJob && request.status === ShippingStatus.ON_WAY && (
                        <div className="flex items-center space-x-2">
                            <Button variant="primary" onClick={() => handleUpdateStatus(ShippingStatus.DELIVERED)} disabled={isExpired}>{t('markAsDelivered')}</Button>
                            <button onClick={(e) => showHelp(HelpTopic.MARK_DELIVERED, e.currentTarget)} className="text-gray-500 hover:text-primary"><QuestionMarkCircleIcon className="w-6 h-6"/></button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

const TransportDashboard: React.FC = () => {
    const { shippingRequests, currentStore } = useAppContext();
    const t = useTranslations();
    const [activeView, setActiveView] = useState('requests');
    
    const navItems = [
        { label: 'deliveryRequests', view: 'requests', icon: DashboardIcon },
        { label: 'myDeliveries', view: 'active', icon: TruckIcon },
        { label: 'deliveryHistory', view: 'history', icon: HistoryIcon },
        { label: 'storeSettings', view: 'settings', icon: SettingsIcon },
    ];
    
    const renderView = () => {
        switch(activeView) {
            case 'active': {
                const myJobs = shippingRequests.filter(r => r.transportStoreId === currentStore?.storeId && (r.status === ShippingStatus.ACCEPTED || r.status === ShippingStatus.ON_WAY));
                return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">{t('myActiveDeliveries')}</h3>
                        {myJobs.length > 0 ? myJobs.map(r => <ShippingRequestCard key={r.requestId} request={r} />) : <p>{t('noActiveDeliveries')}</p>}
                    </div>
                );
            }
            case 'history': {
                const jobHistory = shippingRequests.filter(r => r.transportStoreId === currentStore?.storeId && (r.status === ShippingStatus.DELIVERED || r.status === ShippingStatus.REJECTED));
                 return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">{t('myDeliveryHistory')}</h3>
                        {jobHistory.length > 0 ? jobHistory.map(r => <ShippingRequestCard key={r.requestId} request={r} isHistory={true} />) : <p>{t('noPastDeliveries')}</p>}
                    </div>
                );
            }
            case 'settings': {
                return <ProfileSettingsScreen setActiveView={setActiveView} />;
            }
            case 'subscription': {
                return <SubscriptionScreen />;
            }
            case 'requests':
            default: {
                const availableRequests = shippingRequests.filter(r => r.status === ShippingStatus.WAITING);
                return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">{t('availableDeliveryRequests')}</h3>
                        {availableRequests.length > 0 ? availableRequests.map(r => <ShippingRequestCard key={r.requestId} request={r} />) : <p>{t('noAvailableDeliveryRequests')}</p>}
                    </div>
                );
            }
        }
    };

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('transportCompanyPanel')}</h2>
            {renderView()}
        </DashboardLayout>
    );
};

export default TransportDashboard;