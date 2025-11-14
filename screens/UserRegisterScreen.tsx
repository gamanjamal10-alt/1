import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import Button from '../components/common/Button';
import { AgricultureIcon } from '../components/icons';

interface UserRegisterScreenProps {
  onRegisterSuccess: () => void;
}

const UserRegisterScreen: React.FC<UserRegisterScreenProps> = ({ onRegisterSuccess }) => {
  const { registerUser } = useAppContext();
  const t = useTranslations();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Algeria',
    password: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    setError('');
    setIsRegistering(true);

    try {
      await registerUser(formData);
      alert(t('registrationSuccess'));
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message || t('registrationError'));
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
            <AgricultureIcon className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-primary">{t('createYourAccount')}</h1>
        </header>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="fullName" placeholder={t('fullName')} value={formData.fullName} onChange={handleChange} required className="p-2 border rounded" />
                <input type="email" name="email" placeholder={t('email')} value={formData.email} onChange={handleChange} required className="p-2 border rounded" />
            </div>
            
            <input name="phone" placeholder={t('phone')} value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="password" name="password" placeholder={t('password')} value={formData.password} onChange={handleChange} required className="p-2 border rounded" />
                <input type="password"name="confirmPassword" placeholder={t('confirmPassword')} value={formData.confirmPassword} onChange={handleChange} required className="p-2 border rounded" />
            </div>
             <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input type="checkbox" id="twoFactorEnabled" name="twoFactorEnabled" checked={formData.twoFactorEnabled} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-accent border-gray-300 rounded"/>
                <label htmlFor="twoFactorEnabled" className="text-sm text-gray-600">{t('enable2FA')}</label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isRegistering}>{isRegistering ? '...' : t('register')}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterScreen;