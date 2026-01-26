'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiUser,
  FiChevronDown,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiHelpCircle,
  FiInfo,
  FiBriefcase,
  FiMail,
} from 'react-icons/fi';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Payment Received',
      message: 'KES 15,000 payment confirmed',
      time: '2 mins ago',
      read: false,
    },
    {
      id: 2,
      title: 'Service Update',
      message: 'Data analysis is in progress',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'New Message',
      message: 'You have a new support ticket',
      time: '3 hours ago',
      read: true,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Public navigation items (shown when not logged in)
  const publicNavigation = [
    { name: 'Our Services', href: '/services', icon: FiBriefcase },
    { name: 'About Us', href: '/about', icon: FiInfo },
    { name: 'Contact Us', href: '/contact', icon: FiMail },
    { name: 'Help Center', href: '/support', icon: FiHelpCircle },
  ];

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              DataBizPro
            </Link>
          </div>

          {/* Desktop Navigation - Public Links (only when not logged in) */}
          {!user && (
            <div className="hidden md:flex items-center space-x-8">
              {publicNavigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Search Bar - Only for logged in users */}
          {user && (
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search services, payments, or documents..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle - Always visible */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Notifications - Only for logged in users */}
            {user && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative transition-colors"
                >
                  <FiBell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notifications.filter(n => !n.read).length} unread
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href="/notifications"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile - Only for logged in users */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    {user?.firstName ? (
                      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {user.firstName.charAt(0)}
                      </span>
                    ) : (
                      <FiUser className="text-primary-600 dark:text-primary-400" size={16} />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName || 'User'} {user?.lastName || ''}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role || 'User'}
                    </p>
                  </div>
                  <FiChevronDown
                    className={`text-gray-500 dark:text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.firstName || 'User'} {user?.lastName || ''}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiUser size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiSettings size={16} />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full text-left transition-colors"
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Auth buttons for non-logged in users
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
          >
            {user ? (
              // Mobile menu for logged in users
              <div className="space-y-3">
                <div className="px-3 py-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Mobile menu for non-logged in users
              <div className="space-y-3">
                {publicNavigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-primary-600 text-white text-center rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
