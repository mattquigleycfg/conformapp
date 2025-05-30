import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Search', path: '/dashboard' },
  { label: 'Upload', path: '/dashboard', tab: 'upload' },
  { label: 'Design', path: '/dashboard', tab: 'design' },
  { label: 'Calculator', path: '/calculator' },
  { label: 'Odoo', path: '/dashboard', tab: 'odoo' }
];

interface NavigationTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (tab: typeof TABS[number]) => {
    if (tab.path === '/calculator') {
      navigate('/calculator');
      setActiveTab && setActiveTab('calculator');
    } else if (tab.path === '/dashboard' && tab.tab) {
      navigate('/dashboard');
      setActiveTab && setActiveTab(tab.tab);
    } else {
      navigate(tab.path);
      setActiveTab && setActiveTab(tab.label.toLowerCase());
    }
  };

  return (
    <div className="mb-6 flex space-x-4">
      {TABS.map(tab => {
        const isActive =
          (activeTab && ((tab.tab && activeTab === tab.tab) || (!tab.tab && activeTab === tab.label.toLowerCase()))) ||
          (!activeTab && ((tab.path === '/calculator' && location.pathname.startsWith('/calculator')) || (tab.path === '/dashboard' && location.pathname.startsWith('/dashboard') && (!tab.tab || location.search.includes(tab.tab)))));
        return (
          <button
            key={tab.label}
            className={`px-6 py-2 rounded-lg font-mono transition-colors ${
              isActive
                ? tab.label === 'Odoo'
                  ? 'bg-[#714B67] text-white shadow-sm'
                  : 'bg-primary-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleClick(tab)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;
