import React, { ReactNode } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';

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

// FIX: Destructured setActiveView from props to make it available inside the component.
const SubscriptionBanner: React.FC<{setActiveView: (view: string) => void}> = ({setActiveView}) => {
    const { currentUser } = useAppContext();
    const t = useTranslations();

    if (!currentUser || currentUser.subscriptionPlanId !== 'plan1') return null;

    const endDate = new Date(currentUser.subscriptionEndDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
        return (
             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">{t('trialExpired')}</p>
                <p>{t('trialExpiredMessage')} <button onClick={() => setActiveView('subscription')} className="font-bold underline">{t('upgradeNow')}</button></p>
            </div>
        )
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">{t('freeTrial')}</p>
            <p>{t('trialMessage', { days: daysRemaining.toString() })} <button onClick={() => setActiveView('subscription')} className="font-bold underline">{t('upgrade')}</button></p>
        </div>
    )
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
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
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
      <main className="flex-1 bg-gray-100">
        <SubscriptionBanner setActiveView={setActiveView} />
        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
