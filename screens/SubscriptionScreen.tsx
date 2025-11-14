
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import { SubscriptionPlan, Subscription } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { CheckCircleIcon } from '../components/icons';
import { mockApi } from '../services/mockApi';

const SubscriptionCard: React.FC<{ plan: SubscriptionPlan, isCurrent: boolean, onSelect: () => void }> = ({ plan, isCurrent, onSelect }) => {
    const t = useTranslations();
    const isFree = plan.price === 0;

    return (
        <Card className={`border-2 ${isCurrent ? 'border-accent' : 'border-gray-200'}`}>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-primary">{t(plan.nameKey as any)}</h3>
                <p className="text-4xl font-extrabold my-4">
                    {isFree ? 'Free' : `${plan.price} DZD`}
                    {!isFree && <span className="text-base font-normal text-gray-500"> / {plan.durationDays / 30} {t('months')}</span>}
                </p>
                <ul className="space-y-2 mb-6">
                    {plan.features.map(feature => (
                        <li key={feature} className="flex items-center">
                            <CheckCircleIcon className="w-5 h-5 text-accent me-2" />
                            <span>{t(feature as any)}</span>
                        </li>
                    ))}
                </ul>
                <Button onClick={onSelect} disabled={isCurrent}>
                    {isCurrent ? t('currentPlan') : t('selectPlan')}
                </Button>
            </div>
        </Card>
    );
};


const SubscriptionScreen: React.FC = () => {
    const { currentStore, subscriptionPlans, updateSubscription } = useAppContext();
    const t = useTranslations();
    const [storeSubscription, setStoreSubscription] = useState<Subscription | null>(null);
    const [showPendingModal, setShowPendingModal] = useState(false);

    useEffect(() => {
        if (currentStore) {
            mockApi.getSubscriptionByStoreId(currentStore.storeId).then(sub => {
                if (sub) setStoreSubscription(sub);
            });
        }
    }, [currentStore]);


    if (!currentStore || !storeSubscription) return null;
    
    const currentPlan = subscriptionPlans.find(p => p.planId === storeSubscription.planId);
    const endDate = new Date(storeSubscription.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const handleSelectPlan = (planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M') => {
        // Mock payment flow
        updateSubscription(currentStore.storeId, planId);
        setShowPendingModal(true);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('chooseSubscription')}</h2>

            {currentPlan && (
                <Card className="mb-8 p-6 bg-secondary">
                    <h3 className="text-xl font-bold text-primary">{t('currentPlan')}: {t(currentPlan.nameKey as any)} ({currentStore.storeName})</h3>
                    {daysRemaining > 0 ? (
                        <p className="text-gray-700">{t('daysRemaining', {days: daysRemaining.toString()})}</p>
                    ) : (
                         <p className="text-red-600 font-semibold">{t('trialExpired')}</p>
                    )}
                </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {subscriptionPlans.map(plan => (
                    <SubscriptionCard 
                        key={plan.planId} 
                        plan={plan} 
                        isCurrent={plan.planId === storeSubscription.planId} 
                        onSelect={() => handleSelectPlan(plan.planId)}
                    />
                ))}
            </div>

            {showPendingModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center p-8">
                        <CheckCircleIcon className="w-16 h-16 text-accent mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-primary mb-2">{t('paymentPending')}</h3>
                        <p className="text-gray-600 mb-6">{t('paymentPendingMessage')}</p>
                        <Button onClick={() => setShowPendingModal(false)}>OK</Button>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default SubscriptionScreen;
