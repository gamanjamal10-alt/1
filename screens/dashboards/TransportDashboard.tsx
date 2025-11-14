
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ShippingRequest, ShippingStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MapPinIcon, TruckIcon } from '../../components/icons';

const ShippingRequestCard: React.FC<{ request: ShippingRequest }> = ({ request }) => {
    const { currentUser, updateShippingRequest } = useAppContext();
    const { users, orders } = useAppContext();

    const order = orders.find(o => o.orderId === request.orderId);
    if (!order) return null;

    const seller = users.find(u => u.userId === order.sellerId);
    const buyer = users.find(u => u.userId === order.buyerId);
    
    const isMyJob = request.transportCompanyId === currentUser?.userId;

    const handleAccept = () => {
        const priceStr = prompt("Please enter your delivery price (DH):");
        const price = parseFloat(priceStr || '0');
        if(price > 0 && currentUser) {
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
                    <h4 className="font-bold text-lg text-primary mb-2">Delivery Request #{request.requestId.slice(-5)}</h4>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        request.status === ShippingStatus.WAITING ? 'bg-yellow-200 text-yellow-800' :
                        request.status === ShippingStatus.ACCEPTED ? 'bg-blue-200 text-blue-800' :
                        request.status === ShippingStatus.ON_WAY ? 'bg-indigo-200 text-indigo-800' :
                        'bg-green-200 text-green-800'
                    }`}>{request.status}</span>
                </div>
                
                <div className="my-3 space-y-2 text-gray-700">
                    <div className="flex items-start">
                        <MapPinIcon className="w-5 h-5 mr-2 mt-1 text-accent" />
                        <div><span className="font-semibold">From:</span> {seller?.businessName}<br/><span className="text-sm">{request.pickupAddress}</span></div>
                    </div>
                     <div className="flex items-start">
                        <MapPinIcon className="w-5 h-5 mr-2 mt-1 text-red-500" />
                        <div><span className="font-semibold">To:</span> {buyer?.businessName}<br/><span className="text-sm">{request.deliveryAddress}</span></div>
                    </div>
                </div>

                {request.deliveryPrice && <p>Price: <span className="font-bold text-lg">{request.deliveryPrice} DH</span></p>}
            </div>

            <div className="p-4 bg-gray-50 border-t">
                {request.status === ShippingStatus.WAITING && (
                    <Button variant="accent" onClick={handleAccept}>Accept Request</Button>
                )}
                {isMyJob && request.status === ShippingStatus.ACCEPTED && (
                    <Button onClick={() => handleUpdateStatus(ShippingStatus.ON_WAY)} Icon={TruckIcon}>Start Delivery (On Way)</Button>
                )}
                {isMyJob && request.status === ShippingStatus.ON_WAY && (
                    <Button variant="primary" onClick={() => handleUpdateStatus(ShippingStatus.DELIVERED)}>Mark as Delivered</Button>
                )}
            </div>
        </Card>
    )
}

const TransportDashboard: React.FC = () => {
    const { shippingRequests, currentUser, refreshData } = useAppContext();
    const [availableRequests, setAvailableRequests] = useState<ShippingRequest[]>([]);
    const [myJobs, setMyJobs] = useState<ShippingRequest[]>([]);

    useEffect(() => {
        const available = shippingRequests.filter(r => r.status === ShippingStatus.WAITING);
        const my = shippingRequests.filter(r => r.transportCompanyId === currentUser?.userId && r.status !== ShippingStatus.DELIVERED);
        setAvailableRequests(available);
        setMyJobs(my);
    }, [shippingRequests, currentUser, refreshData]);

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Transport Dashboard</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-4">Available Requests</h3>
                     <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {availableRequests.length > 0 ? availableRequests.map(r => (
                           <ShippingRequestCard key={r.requestId} request={r} />
                        )) : <p>No available delivery requests at the moment.</p>}
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-semibold text-primary mb-4">My Active Deliveries</h3>
                     <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {myJobs.length > 0 ? myJobs.map(r => (
                           <ShippingRequestCard key={r.requestId} request={r} />
                        )) : <p>You have no active deliveries.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportDashboard;
