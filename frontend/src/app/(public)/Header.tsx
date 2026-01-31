'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Our Services',
      href: '/services',
      current: pathname?.startsWith('/services'),
    },
    {
      name: 'About Us',
      href: '/about',
      current: pathname?.startsWith('/about'),
    },
    {
      name: 'Contact Us',
      href: '/contact',
      current: pathname?.startsWith('/contact'),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                <Image
                  src="/mensch.png"
                  alt="Mensch Tech Consultancy Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  MENSCH TECH CONSULTANCY
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analytics & Business Services
                </p>
              </div>
            </Link>
          </div>
          {/* Desktop Navigation - No icons */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-6 py-3 text-lg font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Only mobile menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <FiX className="h-7 w-7" /> : <FiMenu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="space-y-1">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-4 text-lg font-medium rounded-lg ${
                    item.current
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
