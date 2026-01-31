import { FiPlus, FiFileText, FiUsers, FiBell, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      id: 'add-service',
      label: 'Add New Service',
      icon: <FiPlus className="text-blue-600" />,
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      onClick: () => {
        toast.success('Add Service functionality coming soon');
      },
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: <FiFileText className="text-green-600" />,
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      onClick: () => {
        toast.success('Report generation coming soon');
      },
    },
    {
      id: 'manage-users',
      label: 'Manage Users',
      icon: <FiUsers className="text-purple-600" />,
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      onClick: () => {
        // Navigate to users tab
        document.querySelector('button[onclick*="users"]')?.dispatchEvent(new MouseEvent('click'));
        toast.success('Navigating to Users Management');
      },
    },
    {
      id: 'send-notification',
      label: 'Send Notification',
      icon: <FiBell className="text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100',
      onClick: () => {
        toast.success('Notification system coming soon');
      },
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: <FiDownload className="text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      onClick: () => {
        toast.success('Export functionality coming soon');
      },
    },
    {
      id: 'refresh-cache',
      label: 'Refresh Cache',
      icon: <FiRefreshCw className="text-gray-600" />,
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
      onClick: () => {
        localStorage.clear();
        toast.success('Cache cleared. Page will refresh.');
        setTimeout(() => window.location.reload(), 1000);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`w-full flex items-center justify-between p-3 ${action.bgColor} ${action.hoverColor} rounded-lg transition-colors border border-transparent hover:border-gray-300`}
            >
              <div className="flex items-center">
                <span className="mr-3">{action.icon}</span>
                <span className="font-medium text-gray-900">{action.label}</span>
              </div>
              <FiPlus className="text-gray-400 transform rotate-45" />
            </button>
          ))}
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">API Status</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Database</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium text-yellow-600">75% Used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
