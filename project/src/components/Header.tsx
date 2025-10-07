import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { useDropboxAuth } from '../hooks/useDropboxAuth';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useDropboxAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

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
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <HelpCircle size={24} className="text-primary-500" />
            </button>

            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0061FF] text-white">
                    <User size={20} />
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">Signed in with Dropbox</p>
                      <p className="text-xs text-gray-500 mt-1">Connected to your account</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={16} className="text-gray-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;