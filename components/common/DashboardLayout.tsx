
import React, { ReactNode } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';
import { Subscription, SubscriptionStatus } from '../../types';
import { mockApi } from '../../services/mockApi';
import Assistant from './Assistant';

interface NavItem {
  label: string;
  view: string;
  icon: React.FC<{ className?: string }>;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  activeView: string;
  setActiveView: (view: string) => void;
  children: ReactNode;
}

const SubscriptionBanner: React.FC<{setActiveView: (view: string) => void}> = ({setActiveView}) => {
    const { currentStore } = useAppContext();
    const t = useTranslations();
    const [subscription, setSubscription] = React.useState<Subscription | null>(null);

    React.useEffect(() => {
        if (currentStore) {
            mockApi.getSubscriptionByStoreId(currentStore.storeId).then(sub => sub && setSubscription(sub));
        }
    }, [currentStore]);

    if (!currentStore || !subscription) return null;

    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0 || subscription.status === SubscriptionStatus.EXPIRED) {
        return (
             <div className="bg-red-100 border-s-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">{t('trialExpired')}</p>
                <p>{t('trialExpiredMessage')} <button onClick={() => setActiveView('subscription')} className="font-bold underline">{t('upgradeNow')}</button></p>
            </div>
        )
    }

    if (subscription.planId === 'FREE_30') {
        return (
            <div className="bg-yellow-100 border-s-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">{t('freeTrial')}</p>
                <p>{t('trialMessage', { days: daysRemaining.toString() })} <button onClick={() => setActiveView('subscription')} className="font-bold underline">{t('upgrade')}</button></p>
            </div>
        )
    }

    return null;
}


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ navItems, activeView, setActiveView, children }) => {
  const t = useTranslations();
  
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <aside className="w-full md:w-64 bg-primary text-secondary p-4 md:p-6 space-y-2">
        {navItems.map(({ label, view, icon: Icon }) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg text-start transition-colors duration-200 ${
              activeView === view
                ? 'bg-accent text-white font-bold'
                : 'hover:bg-blue-800'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span>{t(label as any)}</span>
          </button>
        ))}
      </aside>
      <main className="flex-1 bg-gray-100 relative">
        <SubscriptionBanner setActiveView={setActiveView} />
        <div className="p-4 md:p-8">
            {children}
        </div>
        <Assistant />
      </main>
    </div>
  );
};

export default DashboardLayout;
