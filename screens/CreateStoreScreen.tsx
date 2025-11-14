import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import Button from '../components/common/Button';
import { AgricultureIcon } from '../components/icons';
import { algerianWilayas } from '../utils/wilayas';

interface CreateStoreScreenProps {
  onStoreCreated: () => void;
}

const CreateStoreScreen: React.FC<CreateStoreScreenProps> = ({ onStoreCreated }) => {
  const { currentUser, createStore, userStores } = useAppContext();
  const t = useTranslations();
  
  const availableStoreTypes = Object.values(UserRole).filter(role => {
      return role !== UserRole.ADMIN && !userStores.some(store => store.storeType === role);
  });

  const [formData, setFormData] = useState({
    storeName: '',
    storeType: availableStoreTypes[0] || UserRole.FARMER,
    country: 'Algeria',
    wilaya: '',
  });
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("You must be logged in to create a store.");
      return;
    }
    setError('');
    setIsCreating(true);

    try {
      await createStore({
          userId: currentUser.userId,
          storeName: formData.storeName,
          storeType: formData.storeType,
          country: formData.country,
          wilaya: formData.wilaya,
      });
      alert('Store created successfully!');
      onStoreCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create store.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
            <AgricultureIcon className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-primary">{t('createAStore')}</h1>
        </header>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="storeName" placeholder={t('storeName')} value={formData.storeName} onChange={handleChange} required className="w-full p-2 border rounded" />
            
            <select name="storeType" value={formData.storeType} onChange={handleChange} className="w-full p-2 border rounded">
                {availableStoreTypes.map(type => (
                    <option key={type} value={type}>{t(`${type.toLowerCase()}Store` as any)}</option>
                ))}
            </select>

            <select name="wilaya" value={formData.wilaya} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="" disabled>{t('wilaya')}</option>
                {algerianWilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex space-x-2 rtl:space-x-reverse pt-4">
                <Button variant="secondary" type="button" onClick={onStoreCreated} className="w-1/2">{t('cancel')}</Button>
                <Button type="submit" disabled={isCreating} className="w-1/2">{isCreating ? '...' : t('createAStore')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStoreScreen;