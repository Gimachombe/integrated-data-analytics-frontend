import {
  FiHome,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiFileText,
  FiShoppingCart,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiX,
} from 'react-icons/fi';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'requests', label: 'Service Requests', icon: <FiPackage /> },
    { id: 'users', label: 'Users', icon: <FiUsers /> },
    { id: 'payments', label: 'Payments', icon: <FiDollarSign /> },
    { id: 'invoices', label: 'Invoices', icon: <FiFileText /> },
    { id: 'services', label: 'Services', icon: <FiShoppingCart /> },
    { id: 'reports', label: 'Reports', icon: <FiPieChart /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <FiX size={24} />
        </button>
      </div>

      <nav className="mt-8 px-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="mt-8 pt-8 border-t border-gray-800">
          <button className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
