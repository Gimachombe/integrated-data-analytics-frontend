import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import AdminNotifications from './AdminNotifications';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  searchTerm,
  setSearchTerm,
}: AdminHeaderProps) {
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      overview: 'Dashboard Overview',
      requests: 'Service Requests',
      users: 'User Management',
      payments: 'Payment Management',
      invoices: 'Invoices & Receipts',
      services: 'Services Management',
      reports: 'Analytics & Reports',
      settings: 'System Settings',
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{getPageTitle()}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:block relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Notifications */}
          <AdminNotifications />

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              AU
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
