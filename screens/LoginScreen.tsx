
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTranslations } from '../hooks/useTranslations';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { AgricultureIcon } from '../components/icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const { login } = useAppContext();
  const t = useTranslations();
  const [email, setEmail] = useState('ahmed.hassan@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      const user = await login(email, password);
      if (user) {
        if (user.enable2FA) {
            // Simulate 2FA check on first login for enabled users
            setShow2FAModal(true);
        } else {
            onLoginSuccess();
        }
      } else {
        setError(t('invalidCredentials'));
      }
    } catch (err) {
      setError(t('loginError'));
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handle2FAConfirm = () => {
    setShow2FAModal(false);
    onLoginSuccess();
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 mb-4">
            <AgricultureIcon className="w-16 h-16 text-accent" />
            <h1 className="text-4xl font-extrabold text-primary">{t('soukElFellah')}</h1>
          </div>
          <p className="text-lg text-gray-700">{t('loginTitle')}</p>
        </header>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            <div>
              <label htmlFor="password">{t('password')}</label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isLoggingIn}>{isLoggingIn ? t('loggingIn') : t('login')}</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('dontHaveAccount')}{' '}
              <button onClick={onGoToRegister} className="font-medium text-primary hover:underline">{t('createAStore')}</button>
            </p>
          </div>
        </div>
      </div>
      <Modal isOpen={show2FAModal} onClose={() => {}} title={t('twoFactorAuth')}>
          <div className="space-y-4">
              <p>{t('enter2FACode')}</p>
              <input type="text" placeholder="123456" className="w-full p-2 border rounded"/>
              <Button onClick={handle2FAConfirm}>{t('confirm')}</Button>
          </div>
      </Modal>
    </div>
  );
};

export default LoginScreen;