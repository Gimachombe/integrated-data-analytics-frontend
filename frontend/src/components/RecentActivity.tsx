'use client';

import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiDollarSign,
  FiUser,
  FiActivity,
} from 'react-icons/fi';
import { format } from 'date-fns';

interface Activity {
  id: number;
  type:
    | 'data_service'
    | 'business_reg'
    | 'kra_service'
    | 'bookkeeping'
    | 'payment'
    | 'user'
    | 'system';
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  date: string;
}

const statusConfig = {
  pending: {
    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    icon: FiClock,
    label: 'Pending',
  },
  in_progress: {
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    icon: FiClock,
    label: 'In Progress',
  },
  completed: {
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    icon: FiCheckCircle,
    label: 'Completed',
  },
  cancelled: {
    color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    icon: FiAlertCircle,
    label: 'Cancelled',
  },
  failed: {
    color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    icon: FiAlertCircle,
    label: 'Failed',
  },
};

const typeConfig = {
  data_service: {
    icon: FiActivity,
    color: 'text-blue-600 dark:text-blue-400',
    label: 'Data Service',
  },
  business_reg: {
    icon: FiFileText,
    color: 'text-green-600 dark:text-green-400',
    label: 'Business',
  },
  kra_service: { icon: FiFileText, color: 'text-purple-600 dark:text-purple-400', label: 'KRA' },
  bookkeeping: {
    icon: FiFileText,
    color: 'text-orange-600 dark:text-orange-400',
    label: 'Bookkeeping',
  },
  payment: { icon: FiDollarSign, color: 'text-green-600 dark:text-green-400', label: 'Payment' },
  user: { icon: FiUser, color: 'text-gray-600 dark:text-gray-400', label: 'User' },
  system: { icon: FiActivity, color: 'text-gray-600 dark:text-gray-400', label: 'System' },
};

// Fallback configuration for unknown types
const getTypeConfig = (type: string) => {
  if (type in typeConfig) {
    return typeConfig[type as keyof typeof typeConfig];
  }
  return { icon: FiActivity, color: 'text-gray-600 dark:text-gray-400', label: type };
};

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <FiActivity size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No recent activity
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Activity will appear here as you use the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map(activity => {
        const statusClass = statusConfig[activity.status] || statusConfig.pending;
        const StatusIcon = statusClass.icon;
        const typeConfig = getTypeConfig(activity.type);
        const ActivityIcon = typeConfig.icon;

        return (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`${typeConfig.color}`}>
                <ActivityIcon size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass.color}`}
                  >
                    <StatusIcon className="mr-1" size={12} />
                    {statusClass.label}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {format(new Date(activity.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
              View Details
            </button>
          </div>
        );
      })}
    </div>
  );
}
