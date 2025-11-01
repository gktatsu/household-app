import React, { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { navItems } from './navItems';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const Layout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleOpenMobileNav = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const handleCloseMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      setIsMobileNavOpen(false);
      await signOut();
      toast.success('ログアウトしました');
      navigate('/login');
    } catch {
      toast.error('ログアウトに失敗しました');
    }
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleMobileNav={handleOpenMobileNav}
        onSignOut={handleSignOut}
        userEmail={user?.email}
      />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={handleCloseMobileNav}
        items={navItems}
        userEmail={user?.email}
        onSignOut={handleSignOut}
      />
    </div>
  );
};