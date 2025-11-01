import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 bg-white shadow-sm h-[calc(100vh-73px)] fixed">
      <nav className="p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};