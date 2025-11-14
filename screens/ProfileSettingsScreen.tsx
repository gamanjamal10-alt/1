
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ProfileSettingsScreen: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">Profile Settings</h2>
      <Card className="max-w-2xl">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={currentUser.profilePhoto} alt={currentUser.fullName} className="w-24 h-24 rounded-full object-cover"/>
            <div>
              <h3 className="text-2xl font-bold text-primary">{currentUser.fullName}</h3>
              <p className="text-gray-600">{currentUser.businessName}</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-2">Contact Information</h4>
            <p><strong>Account Type:</strong> {currentUser.accountType}</p>
            <p><strong>Phone:</strong> {currentUser.phoneNumber}</p>
            <p><strong>Address:</strong> {currentUser.address}</p>
            <p><strong>Member Since:</strong> {currentUser.registrationDate}</p>
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t">
          <Button variant="secondary" onClick={() => alert('Edit profile feature coming soon!')} className="w-auto">
            Edit Profile
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettingsScreen;