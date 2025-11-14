
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ShippingRequest, ShippingStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MapPinIcon, TruckIcon, DashboardIcon, HistoryIcon, SettingsIcon } from '../../components/icons';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProfileSettingsScreen from '../ProfileSettingsScreen';

const ShippingRequestCard: React.FC<{ request: ShippingRequest, isHistory?: boolean }> = ({ request, isHistory = false }) => {
    const { currentUser, updateShippingRequest, users, orders } = useAppContext();
    const order = orders.find(o => o.orderId === request.orderId);
    if (!order) return null;
    const seller = users.find(u => u.userId === order.sellerId);
    const buyer = users.find(u => u.userId === order.buyerId);
    const isMyJob = request.transportCompanyId === currentUser?.userId;

    const handleAccept = () => {
        const priceStr = prompt("Please enter your delivery price (DH):");
        const price = parseFloat(priceStr || '0');
        if (price > 0 && currentUser) {
            updateShippingRequest(request.requestId, ShippingStatus.ACCEPTED, currentUser.userId, price);
            alert("Delivery request accepted!");
        } else {
            alert("Invalid price.");
        }
    };
    
    const handleUpdateStatus = (status: ShippingStatus) => {
        updateShippingRequest(request.requestId, status);
        alert(`Delivery status updated to ${status}!`);
    };

    return (
        <Card className="mb-4">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-primary mb-2">Delivery #{request.requestId.slice(-5)}</h4>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        request.status === ShippingStatus.WAITING ? 'bg-yellow-200 text-yellow-800' :
                        request.status === ShippingStatus.ACCEPTED ? 'bg-blue-200 text-blue-800' :
                        request.status === ShippingStatus.ON_WAY ? 'bg-indigo-200 text-indigo-800' :
                        request.status === ShippingStatus.DELIVERED ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                    }`}>{request.status}</span>
                </div>
                <div className="my-3 space-y-2 text-gray-700">
                     <div className="flex items-start"><MapPinIcon className="w-5 h-5 mr-2 mt-1 text-accent" /><div><span className="font-semibold">From:</span> {request.pickupAddress}</div></div>
                     <div className="flex items-start"><MapPinIcon className="w-5 h-5 mr-2 mt-1 text-red-500" /><div><span className="font-semibold">To:</span> {request.deliveryAddress}</div></div>
                </div>
                {request.deliveryPrice && <p>Price: <span className="font-bold text-lg">{request.deliveryPrice} DH</span></p>}
            </div>
            {!isHistory && (
                 <div className="p-4 bg-gray-50 border-t">
                    {request.status === ShippingStatus.WAITING && (<Button variant="accent" onClick={handleAccept}>Accept Request</Button>)}
                    {isMyJob && request.status === ShippingStatus.ACCEPTED && (<Button onClick={() => handleUpdateStatus(ShippingStatus.ON_WAY)} Icon={TruckIcon}>Start Delivery</Button>)}
                    {isMyJob && request.status === ShippingStatus.ON_WAY && (<Button variant="primary" onClick={() => handleUpdateStatus(ShippingStatus.DELIVERED)}>Mark as Delivered</Button>)}
                </div>
            )}
        </Card>
    );
};

const TransportDashboard: React.FC = () => {
    const { shippingRequests, currentUser, refreshData } = useAppContext();
    const [activeView, setActiveView] = useState('requests');
    
    const navItems = [
        { label: 'Delivery Requests', view: 'requests', icon: DashboardIcon },
        { label: 'My Deliveries', view: 'active', icon: TruckIcon },
        { label: 'Delivery History', view: 'history', icon: HistoryIcon },
        { label: 'Profile Settings', view: 'settings', icon: SettingsIcon },
    ];
    
    const renderView = () => {
        switch(activeView) {
            case 'active': {
                const myJobs = shippingRequests.filter(r => r.transportCompanyId === currentUser?.userId && (r.status === ShippingStatus.ACCEPTED || r.status === ShippingStatus.ON_WAY));
                return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">My Active Deliveries</h3>
                        {myJobs.length > 0 ? myJobs.map(r => <ShippingRequestCard key={r.requestId} request={r} />) : <p>You have no active deliveries.</p>}
                    </div>
                );
            }
            case 'history': {
                const jobHistory = shippingRequests.filter(r => r.transportCompanyId === currentUser?.userId && (r.status === ShippingStatus.DELIVERED || r.status === ShippingStatus.REJECTED));
                 return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">My Delivery History</h3>
                        {jobHistory.length > 0 ? jobHistory.map(r => <ShippingRequestCard key={r.requestId} request={r} isHistory={true} />) : <p>You have no past deliveries.</p>}
                    </div>
                );
            }
            case 'settings': {
                return <ProfileSettingsScreen />;
            }
            case 'requests':
            default: {
                const availableRequests = shippingRequests.filter(r => r.status === ShippingStatus.WAITING);
                return (
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-4">Available Delivery Requests</h3>
                        {availableRequests.length > 0 ? availableRequests.map(r => <ShippingRequestCard key={r.requestId} request={r} />) : <p>No available delivery requests.</p>}
                    </div>
                );
            }
        }
    };

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-primary mb-6">Transport Company Panel</h2>
            {renderView()}
        </DashboardLayout>
    );
};

export default TransportDashboard;