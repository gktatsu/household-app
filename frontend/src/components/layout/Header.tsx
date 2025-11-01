import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type HeaderProps = {
  onToggleMobileNav: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('ログアウトしました');
      navigate('/login');
    } catch {
      toast.error('ログアウトに失敗しました');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="メニューを開く"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-primary-600">
            Multi-Currency Household
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
};