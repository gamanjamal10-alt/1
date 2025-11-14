
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole } from '../types';
import { AgricultureIcon, TruckIcon, CartIcon, UserGroupIcon } from '../components/icons';
import Card from '../components/common/Card';

const RoleCard: React.FC<{ role: UserRole; users: User[]; onSelectUser: (userId: string) => void }> = ({ role, users, onSelectUser }) => {
    const roleConfig = {
        [UserRole.FARMER]: { icon: AgricultureIcon, color: 'text-accent', title: 'Farmer Section' },
        [UserRole.WHOLESALER]: { icon: UserGroupIcon, color: 'text-blue-500', title: 'Wholesaler Section' },
        [UserRole.RETAILER]: { icon: CartIcon, color: 'text-purple-500', title: 'Retailer Section' },
        [UserRole.TRANSPORT]: { icon: TruckIcon, color: 'text-orange-500', title: 'Transport Section' },
    };

    const { icon: Icon, color, title } = roleConfig[role];
    const filteredUsers = users.filter(u => u.accountType === role);

    return (
        <Card className="p-6 flex flex-col items-center text-center bg-white hover:shadow-xl transition-shadow duration-300">
            <Icon className={`w-16 h-16 ${color} mb-4`} />
            <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
            <p className="text-gray-600 mb-4">Login as:</p>
            <div className="w-full space-y-2">
                {filteredUsers.map(user => (
                    <button
                        key={user.userId}
                        onClick={() => onSelectUser(user.userId)}
                        className="w-full bg-secondary hover:bg-yellow-200 text-primary font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        {user.fullName}
                    </button>
                ))}
            </div>
        </Card>
    );
};

const LoginScreen: React.FC = () => {
    const { users, login } = useAppContext();

    return (
        <div className="min-h-screen bg-secondary">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <div className="inline-flex items-center space-x-4 mb-4">
                        <AgricultureIcon className="w-20 h-20 text-accent" />
                        <h1 className="text-5xl font-extrabold text-primary">Souk El Fellah</h1>
                    </div>
                    <p className="text-xl text-gray-700">Connecting Agriculture: From Farm to Market</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <RoleCard role={UserRole.FARMER} users={users} onSelectUser={login} />
                    <RoleCard role={UserRole.WHOLESALER} users={users} onSelectUser={login} />
                    <RoleCard role={UserRole.RETAILER} users={users} onSelectUser={login} />
                    <RoleCard role={UserRole.TRANSPORT} users={users} onSelectUser={login} />
                </div>
                 <footer className="text-center text-gray-600 mt-12">
                    <p>&copy; 2024 Souk El Fellah. All rights reserved.</p>
                    <p className="text-sm">This is a demonstration application. No real transactions are processed.</p>
                </footer>
            </div>
        </div>
    );
};

export default LoginScreen;
