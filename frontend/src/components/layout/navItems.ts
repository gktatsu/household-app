import type { ComponentType, SVGProps } from 'react';
import { HomeIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const navItems: NavItem[] = [
  { to: '/dashboard', icon: HomeIcon, label: 'ダッシュボード' },
  { to: '/transactions', icon: BanknotesIcon, label: '取引履歴' },
];
