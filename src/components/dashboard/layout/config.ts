import type { NavItemConfig } from '@/types/nav';

export const doctorNavItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: '/doctor-dashboard', icon: 'chart-pie' },
  { key: 'chat', title: 'Chat', href: '/chat', icon: 'ph-chat' },
  { key: 'chat', title: 'Account', href: '/dashboard/account', icon: 'user' },
];

export const patientNavItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: '/dashboard', icon: 'chart-pie' },
  { key: 'chat', title: 'Chat', href: '/chat', icon: 'ph-chat' },
  { key: 'chat', title: 'Account', href: '/dashboard/account', icon: 'user' },
];

