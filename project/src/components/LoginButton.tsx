import React from 'react';

interface LoginButtonProps {
  onLogin: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLogin }) => {
  return (
    <button
      onClick={onLogin}
      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-[#0061FF] hover:bg-[#0051D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0061FF] transition-colors shadow-sm space-x-3"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L6 4.8l6 4.8-6 4.8 6 4.8 6-4.8-6-4.8 6-4.8L12 0zM6 14.4v2.4L12 21.6l6-4.8v-2.4l-6 4.8-6-4.8z"/>
      </svg>
      <span>Sign in with Dropbox</span>
    </button>
  );
};

export default LoginButton;