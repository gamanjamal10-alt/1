
import React from 'react';
import { UserRole } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { AgricultureIcon, UserGroupIcon, CartIcon, TruckIcon } from '../components/icons';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

interface ChooseStoreTypeScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleButton: React.FC<{ role: UserRole; title: string; icon: React.FC<{className?:string}>; onClick: () => void }> = ({ role, title, icon: Icon, onClick }) => {
  const roleConfig = {
    [UserRole.FARMER]: { color: 'bg-accent' },
    [UserRole.WHOLESALER]: { color: 'bg-blue-500' },
    [UserRole.RETAILER]: { color: 'bg-purple-500' },
    [UserRole.TRANSPORT]: { color: 'bg-orange-500' },
  };

  return (
      <Card className="text-center p-6 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 ${roleConfig[role].color}`}>
              <Icon className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
          <Button onClick={onClick} className="mt-auto">Choose</Button>
      </Card>
  )
}

const ChooseStoreTypeScreen: React.FC<ChooseStoreTypeScreenProps> = ({ onSelectRole }) => {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
       <header className="text-center mb-12">
            <div className="inline-flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <AgricultureIcon className="w-20 h-20 text-accent" />
                <h1 className="text-5xl font-extrabold text-primary">{t('soukElFellah')}</h1>
            </div>
            <p className="text-xl text-gray-700">{t('chooseStoreType')}</p>
        </header>
        <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <RoleButton role={UserRole.FARMER} title={t('farmerStore')} icon={AgricultureIcon} onClick={() => onSelectRole(UserRole.FARMER)} />
                <RoleButton role={UserRole.WHOLESALER} title={t('wholesalerStore')} icon={UserGroupIcon} onClick={() => onSelectRole(UserRole.WHOLESALER)} />
                <RoleButton role={UserRole.RETAILER} title={t('retailerStore')} icon={CartIcon} onClick={() => onSelectRole(UserRole.RETAILER)} />
                <RoleButton role={UserRole.TRANSPORT} title={t('transportStore')} icon={TruckIcon} onClick={() => onSelectRole(UserRole.TRANSPORT)} />
            </div>
        </div>
    </div>
  );
};

export default ChooseStoreTypeScreen;
