'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiPieChart,
  FiFileText,
  FiCheckCircle,
  FiDollarSign,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiUser,
  FiBell,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiBriefcase,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // If user is not authenticated, don't show sidebar
  if (!user) {
    return null;
  }

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Data Services', href: '/data-services', icon: FiPieChart },
    { name: 'Business Registration', href: '/business-registration', icon: FiFileText },
    { name: 'KRA Services', href: '/kra-services', icon: FiCheckCircle },
    { name: 'Bookkeeping', href: '/bookkeeping', icon: FiBriefcase },
    { name: 'Payments', href: '/payments', icon: FiDollarSign },
  ];

  const adminNavigation =
    user?.role === 'admin'
      ? [
          { name: 'Admin Dashboard', href: '/admin', icon: FiUsers },
          { name: 'Analytics', href: '/admin/analytics', icon: FiTrendingUp },
        ]
      : [];

  const secondaryNavigation = [
    { name: 'Notifications', href: '/notifications', icon: FiBell },
    { name: 'Profile', href: '/profile', icon: FiUser },
    { name: 'Settings', href: '/settings', icon: FiSettings },
    { name: 'Help & Support', href: '/support', icon: FiHelpCircle },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          DataBizPro
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Business Dashboard</p>
      </div>

      {/* User Profile in Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            {user?.firstName && user?.lastName ? (
              <span className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            ) : (
              <FiUser className="text-primary-600 dark:text-primary-400" size={20} />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.firstName || 'User'} {user?.lastName || ''}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {mainNavigation.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Admin Navigation */}
        {adminNavigation.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Admin
            </p>
            {adminNavigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        {secondaryNavigation.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} DataBizPro. All rights reserved.
        </p>
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <FiShield className="mr-1" size={12} />
          <span>Secure & Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
