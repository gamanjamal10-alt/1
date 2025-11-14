
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Language } from '../types';
import LanguageSelector from '../components/common/LanguageSelector';

interface ProfileSettingsScreenProps {
    setActiveView: (view: string) => void;
}

const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ setActiveView }) => {
  const { currentUser, updateUser } = useAppContext();
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
      fullName: currentUser?.fullName || '',
      businessName: currentUser?.businessName || '',
      phoneNumber: currentUser?.phoneNumber || '',
      enable2FA: currentUser?.enable2FA || false,
  });

  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  const handleSave = async () => {
      await updateUser(currentUser.userId, {
          fullName: formData.fullName,
          businessName: formData.businessName,
          phoneNumber: formData.phoneNumber,
          enable2FA: formData.enable2FA,
      });
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
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={currentUser.profilePhoto} alt={currentUser.fullName} className="w-24 h-24 rounded-full object-cover"/>
            <div>
              {isEditing ? (
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="text-2xl font-bold text-primary border-b-2"/>
              ) : (
                <h3 className="text-2xl font-bold text-primary">{currentUser.fullName}</h3>
              )}
              {isEditing ? (
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="text-gray-600 border-b"/>
              ) : (
                <p className="text-gray-600">{currentUser.businessName}</p>
              )}
            </div>
          </div>
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong className="block text-gray-500">{t('accountType')}</strong> {currentUser.accountType}</div>
              <div><strong className="block text-gray-500">{t('email')}</strong> {currentUser.email}</div>
              <div>
                  <strong className="block text-gray-500">{t('phone')}</strong>
                  {isEditing ? <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border-b" /> : currentUser.phoneNumber}
              </div>
              <div><strong className="block text-gray-500">{t('country')}</strong> {currentUser.country}</div>
              <div><strong className="block text-gray-500">{t('memberSince')}</strong> {currentUser.registrationDate}</div>
              <div>
                  <strong className="block text-gray-500">{t('language')}</strong>
                  <LanguageSelector />
              </div>
          </div>
           <div className="pt-4 border-t">
                <h4 className="font-semibold text-lg mb-2">{t('security')}</h4>
                <div className="flex items-center justify-between">
                    <label htmlFor="enable2FA" className="font-medium text-gray-700">{t('enable2FA')}</label>
                    <div className={`relative inline-block w-14 mr-2 align-middle select-none transition duration-200 ease-in`}>
                         <input type="checkbox" name="enable2FA" id="enable2FA" checked={formData.enable2FA} onChange={handleChange} disabled={!isEditing}
                            className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                         <label htmlFor="enable2FA" className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                </div>
           </div>
           <div className="pt-4 border-t">
               <Button variant="secondary" onClick={() => setActiveView('subscription')} className="w-auto">
                   {t('manageSubscription')}
               </Button>
           </div>
        </div>
        <div className="p-6 bg-gray-50 border-t flex space-x-2">
            {isEditing ? (
                <>
                    <Button onClick={handleSave} className="w-auto">{t('saveChanges')}</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="w-auto">{t('cancel')}</Button>
                </>
            ) : (
                <Button variant="primary" onClick={() => setIsEditing(true)} className="w-auto">{t('editProfile')}</Button>
            )}
        </div>
      </Card>
      <style>{`.toggle-checkbox:checked { right: 0; border-color: #6da34d; } .toggle-checkbox:checked + .toggle-label { background-color: #6da34d; }`}</style>
    </div>
  );
};

export default ProfileSettingsScreen;