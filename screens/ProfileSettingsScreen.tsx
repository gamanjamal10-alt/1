
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LanguageSelector from '../components/common/LanguageSelector';

interface StoreSettingsScreenProps {
    setActiveView: (view: string) => void;
}

const StoreSettingsScreen: React.FC<StoreSettingsScreenProps> = ({ setActiveView }) => {
  const { currentUser, currentStore, updateUser } = useAppContext(); // updateUser can be used for user-specific settings like 2FA in the future
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  
  // For now, settings are mostly display. A mock 'updateStore' would be needed for full functionality.
  const [formData, setFormData] = useState({
      storeName: currentStore?.storeName || '',
      // Add other editable store fields here
  });

  if (!currentUser || !currentStore) {
    return <div>Loading...</div>;
  }
  
  const handleSave = async () => {
      // In a real app, you'd call an `updateStore` function from the context.
      // await updateStore(currentStore.storeId, { storeName: formData.storeName });
      alert('Store settings saved (mocked).');
      setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">{t('storeSettings')}</h2>
      <Card className="max-w-3xl">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse">
            <img src={currentStore.profilePhoto} alt={currentStore.storeName} className="w-24 h-24 rounded-full object-cover"/>
            <div>
              {isEditing ? (
                  <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="text-2xl font-bold text-primary border-b-2"/>
              ) : (
                <h3 className="text-2xl font-bold text-primary">{currentStore.storeName}</h3>
              )}
               <p className="text-gray-600">{currentUser.fullName}</p>
            </div>
          </div>
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong className="block text-gray-500">{t('storeType')}</strong> {currentStore.storeType}</div>
              <div><strong className="block text-gray-500">{t('email')}</strong> {currentUser.email}</div>
              <div><strong className="block text-gray-500">{t('phone')}</strong>{currentUser.phone}</div>
              <div><strong className="block text-gray-500">{t('country')}</strong> {currentUser.country}</div>
               {currentStore.wilaya && <div><strong className="block text-gray-500">{t('wilaya')}</strong> {currentStore.wilaya}</div>}
              <div><strong className="block text-gray-500">{t('memberSince')}</strong> {currentStore.createdAt}</div>
              <div>
                  <strong className="block text-gray-500">{t('language')}</strong>
                  <LanguageSelector />
              </div>
          </div>
           <div className="pt-4 border-t">
               <Button variant="secondary" onClick={() => setActiveView('subscription')} className="w-auto">
                   {t('manageSubscription')}
               </Button>
           </div>
        </div>
        <div className="p-6 bg-gray-50 border-t flex space-x-2 rtl:space-x-reverse">
            {isEditing ? (
                <>
                    <Button onClick={handleSave} className="w-auto">{t('saveChanges')}</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="w-auto">{t('cancel')}</Button>
                </>
            ) : (
                <Button variant="primary" onClick={() => setIsEditing(true)} className="w-auto">{t('editStore')} {t('settings')}</Button>
            )}
        </div>
      </Card>
    </div>
  );
};

export default StoreSettingsScreen;
