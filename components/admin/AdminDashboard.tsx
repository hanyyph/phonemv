
import React, { useState } from 'react';
import ManagePhones from './ManagePhones';
import ManageShops from './ManageShops';
import ManagePrices from './ManagePrices';
import { Smartphone, Store, Tag } from 'lucide-react';

type AdminTab = 'phones' | 'shops' | 'prices';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('phones');

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'phones', label: 'Phones', icon: <Smartphone className="mr-2 h-5 w-5" /> },
    { id: 'shops', label: 'Shops', icon: <Store className="mr-2 h-5 w-5" /> },
    { id: 'prices', label: 'Prices', icon: <Tag className="mr-2 h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'phones':
        return <ManagePhones />;
      case 'shops':
        return <ManageShops />;
      case 'prices':
        return <ManagePrices />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 -mb-px text-sm font-semibold transition-colors duration-200 ease-in-out border-b-2
              ${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
