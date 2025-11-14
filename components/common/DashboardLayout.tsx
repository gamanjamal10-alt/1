
import React, { ReactNode } from 'react';

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

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ navItems, activeView, setActiveView, children }) => {
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
            <span>{label}</span>
          </button>
        ))}
      </aside>
      <main className="flex-1 p-4 md:p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;