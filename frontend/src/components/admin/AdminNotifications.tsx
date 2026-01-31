'use client';

import { useState } from 'react';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'New service request #SR-2024-001',
      time: '5 minutes ago',
      read: false,
      type: 'info',
    },
    {
      id: 2,
      message: 'Payment completed for #SR-2024-002',
      time: '1 hour ago',
      read: false,
      type: 'success',
    },
    {
      id: 3,
      message: 'Service request #SR-2024-003 completed',
      time: '3 hours ago',
      read: true,
      type: 'success',
    },
    {
      id: 4,
      message: 'New user registered: John Doe',
      time: '5 hours ago',
      read: true,
      type: 'info',
    },
    {
      id: 5,
      message: 'System backup completed successfully',
      time: '1 day ago',
      read: true,
      type: 'success',
    },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 text-gray-500 hover:text-gray-700 relative"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            notification.type === 'success'
                              ? 'bg-green-500'
                              : notification.type === 'warning'
                                ? 'bg-yellow-500'
                                : notification.type === 'error'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                          }`}
                        ></span>
                        <p className="text-sm text-gray-900">{notification.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <FiBell className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-gray-500">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
      )}
    </div>
  );
}
