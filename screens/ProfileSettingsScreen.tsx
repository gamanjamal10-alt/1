
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LanguageSelector from '../components/common/LanguageSelector';
import ColorPicker from '../components/common/ColorPicker';
import Modal from '../components/common/Modal';
import { UserRole } from '../types';

interface StoreSettingsScreenProps {
    setActiveView: (view: string) => void;
}

const predefinedAvatars = [
    'https://picsum.photos/seed/avatar1/200',
    'https://picsum.photos/seed/avatar2/200',
    'https://picsum.photos/seed/avatar3/200',
    'https://picsum.photos/seed/avatar4/200',
    'https://picsum.photos/seed/avatar5/200',
    'https://picsum.photos/seed/avatar6/200',
];

const ProfileSettingsScreen: React.FC<StoreSettingsScreenProps> = ({ setActiveView }) => {
  const { currentUser, currentStore, updateStore, deleteStore, deleteUser } = useAppContext();
  const t = useTranslations();
  
  const defaultColors = {
      primary: '#004e92',
      secondary: '#f4e9d2',
      accent: '#6da34d',
  };

  const [themeColors, setThemeColors] = useState(currentStore?.themeColors || defaultColors);
  const [showDeleteStoreModal, setShowDeleteStoreModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');


  useEffect(() => {
      setThemeColors(currentStore?.themeColors || defaultColors);
  }, [currentStore]);

  if (!currentUser || !currentStore) {
    return <div>Loading...</div>;
  }

  const handleColorChange = (name: 'primary' | 'secondary' | 'accent', color: string) => {
      setThemeColors(prev => ({ ...prev, [name]: color }));
  };
  
  const handleThemeSave = async () => {
      await updateStore(currentStore.storeId, { themeColors });
      alert('Theme saved successfully!');
  };

  const handleDeleteStore = async () => {
      if (confirmationText === currentStore.storeName) {
          await deleteStore(currentStore.storeId);
          // App will navigate away as currentStore becomes null
      } else {
          alert('Store name does not match.');
      }
      setShowDeleteStoreModal(false);
      setConfirmationText('');
  };

  const handleDeleteAccount = async () => {
       if (confirmationText === currentUser.fullName) {
           await deleteUser(currentUser.userId);
           // App will navigate to login as user becomes null
       } else {
           alert('Full name does not match.');
       }
       setShowDeleteAccountModal(false);
       setConfirmationText('');
  };

  const handlePhotoUpdate = async (newPhotoUrl: string) => {
    await updateStore(currentStore.storeId, { profilePhoto: newPhotoUrl });
    alert(t('photoUpdatedSuccess'));
    setShowPhotoModal(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'logo') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          if (type === 'photo') {
            handlePhotoUpdate(reader.result as string);
          } else {
            handleLogoUpdate(reader.result as string);
          }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogoUpdate = async (newLogoUrl: string) => {
      await updateStore(currentStore.storeId, { storeLogo: newLogoUrl });
      alert(t('logoUpdatedSuccess'));
      setShowLogoModal(false);
  };

  const isPhotoChangeAllowed = currentStore.storeType === UserRole.FARMER || currentStore.storeType === UserRole.RETAILER;

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">{t('storeSettings')}</h2>
      
      {/* General Info Card */}
      <Card className="max-w-3xl mb-8">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse">
            <div className="relative group">
                <img src={currentStore.profilePhoto} alt={currentStore.storeName} className="w-24 h-24 rounded-full object-cover"/>
                {isPhotoChangeAllowed && (
                    <button 
                        onClick={() => setShowPhotoModal(true)}
                        className="absolute inset-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {t('changePhoto')}
                    </button>
                )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">{currentStore.storeName}</h3>
              <p className="text-gray-600">{currentUser.fullName}</p>
            </div>
          </div>
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong className="block text-gray-500">{t('storeType')}</strong> {currentStore.storeType}</div>
              <div><strong className="block text-gray-500">{t('email')}</strong> {currentUser.email}</div>
              <div><strong className="block text-gray-500">{t('phone')}</strong>{currentUser.phone}</div>
              <div><strong className="block text-gray-500">{t('country')}</strong> {currentStore.country}</div>
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
      </Card>
      
      {/* Store Branding Card */}
      <Card className="max-w-3xl mb-8">
        <div className="p-6">
            <h3 className="text-2xl font-bold text-primary mb-2">{t('storeBranding')}</h3>
            <p className="text-gray-600 mb-4">{t('storeBrandingDesc')}</p>
            <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                    {currentStore.storeLogo ? (
                        <img src={currentStore.storeLogo} alt="Store Logo" className="w-full h-full object-contain rounded-md" />
                    ) : (
                        <span className="text-xs text-gray-500">{t('noLogo')}</span>
                    )}
                </div>
                <Button onClick={() => setShowLogoModal(true)} className="w-auto">{t('changeLogo')}</Button>
            </div>
        </div>
      </Card>

      {/* Appearance Card */}
      <Card className="max-w-3xl mb-8">
        <div className="p-6">
            <h3 className="text-2xl font-bold text-primary mb-2">{t('appearance')}</h3>
            <p className="text-gray-600 mb-4">{t('customizeTheme')}</p>
            <div className="space-y-4">
                <ColorPicker label={t('primaryColor')} name="primary" color={themeColors.primary} onChange={(c) => handleColorChange('primary', c)} />
                <ColorPicker label={t('secondaryColor')} name="secondary" color={themeColors.secondary} onChange={(c) => handleColorChange('secondary', c)} />
                <ColorPicker label={t('accentColor')} name="accent" color={themeColors.accent} onChange={(c) => handleColorChange('accent', c)} />
            </div>
        </div>
        <div className="p-6 bg-gray-50 border-t">
            <Button onClick={handleThemeSave} className="w-auto">{t('saveChanges')}</Button>
        </div>
      </Card>
      
      {/* Danger Zone Card */}
      <Card className="max-w-3xl border-2 border-red-500">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-red-700">{t('dangerZone')}</h3>
            <p className="text-gray-600 mb-4">{t('dangerZoneWarning')}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
                <Button onClick={() => setShowDeleteStoreModal(true)} className="!bg-red-600 hover:!bg-red-800 w-auto">{t('deleteStore')}</Button>
                <Button onClick={() => setShowDeleteAccountModal(true)} className="!bg-red-600 hover:!bg-red-800 w-auto">{t('deleteAccount')}</Button>
            </div>
          </div>
      </Card>
      
      {/* Modals */}
      <Modal isOpen={showDeleteStoreModal} onClose={() => setShowDeleteStoreModal(false)} title={t('deleteStore')}>
        <div className="space-y-4">
            <p>{t('deleteStoreConfirmation', { storeName: currentStore.storeName })}</p>
            <input type="text" placeholder={t('typeToConfirm')} value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} className="w-full p-2 border rounded"/>
            <Button onClick={handleDeleteStore} className="!bg-red-600 hover:!bg-red-800" disabled={confirmationText !== currentStore.storeName}>{t('confirmDelete')}</Button>
        </div>
      </Modal>
      <Modal isOpen={showDeleteAccountModal} onClose={() => setShowDeleteAccountModal(false)} title={t('deleteAccount')}>
        <div className="space-y-4">
            <p>{t('deleteAccountConfirmation', { fullName: currentUser.fullName })}</p>
            <input type="text" placeholder={t('typeToConfirm')} value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} className="w-full p-2 border rounded"/>
            <Button onClick={handleDeleteAccount} className="!bg-red-600 hover:!bg-red-800" disabled={confirmationText !== currentUser.fullName}>{t('confirmDelete')}</Button>
        </div>
      </Modal>

      <Modal isOpen={showPhotoModal} onClose={() => setShowPhotoModal(false)} title={t('selectProfilePhoto')}>
        <div className="space-y-6">
            <div>
                <label htmlFor="photo-upload" className="block text-lg font-semibold text-primary mb-2">{t('uploadFromDevice')}</label>
                <input id="photo-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800"/>
            </div>
            <div>
                 <h4 className="text-lg font-semibold text-primary mb-2">{t('chooseAnAvatar')}</h4>
                 <div className="grid grid-cols-3 gap-4">
                    {predefinedAvatars.map(avatar => (
                        <button key={avatar} onClick={() => handlePhotoUpdate(avatar)} className="rounded-full overflow-hidden border-2 border-transparent hover:border-accent focus:border-accent focus:outline-none transition">
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover"/>
                        </button>
                    ))}
                 </div>
            </div>
        </div>
      </Modal>
      
      <Modal isOpen={showLogoModal} onClose={() => setShowLogoModal(false)} title={t('changeLogo')}>
        <div className="space-y-6">
            <div>
                <label htmlFor="logo-upload" className="block text-lg font-semibold text-primary mb-2">{t('uploadFromDevice')}</label>
                <p className="text-sm text-gray-500 mb-2">{t('logoSpecs')}</p>
                <input id="logo-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800"/>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default ProfileSettingsScreen;