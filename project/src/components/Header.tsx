import React from 'react';
import { HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/Cf Logo Favicon 2022 256px.png"
              alt="Con-form Group"
              className="h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Con-form Group</h1>
              <h2 className="text-sm text-gray-600">Document Management System</h2>
            </div>
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <HelpCircle size={24} className="text-primary-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;