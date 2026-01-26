'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Don't show sidebar on login/register pages or homepage
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isHomePage = pathname === '/';
  const shouldShowSidebar = user && !isAuthPage && !isHomePage;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (shouldShowSidebar) {
    return (
      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    );
  }

  // For non-authenticated pages or homepage
  return <main className="p-4 md:p-6">{children}</main>;
}
