'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiTrash2, FiFilter, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api'; // Import the API service
import toast from 'react-hot-toast';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'payment' | 'service' | 'message' | 'document' | 'system' | 'general';
  created_at: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch notifications from backend
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      // If no user, show loading then redirect
      const timer = setTimeout(() => {
        setIsLoading(false);
        setNotifications(getMockNotifications());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      // Using the API service which automatically adds auth headers
      const response = await api.get('/notifications');

      // Handle different response formats
      let notificationsData: Notification[] = [];

      if (response.success && response.notifications) {
        // Format from our backend route
        notificationsData = response.notifications;
      } else if (Array.isArray(response)) {
        // Direct array response
        notificationsData = response;
      } else if (response && typeof response === 'object') {
        // Try to extract notifications from response
        notificationsData = response.data || response.notifications || [];
      }

      setNotifications(notificationsData);
      toast.success('Notifications loaded');
    } catch (error: any) {
      console.error('Error fetching notifications:', error);

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Please login again');
        // The API service interceptor should handle redirect
      } else {
        toast.error('Failed to load notifications. Using demo data.');
        setNotifications(getMockNotifications());
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data fallback
  const getMockNotifications = (): Notification[] => {
    return [
      {
        id: 1,
        title: 'Welcome to Data Business Platform',
        message: 'Your account has been successfully created. Start by exploring our services.',
        time: new Date().toISOString(),
        read: false,
        type: 'system',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Profile Update Required',
        message: 'Please complete your profile to access all features.',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        type: 'message',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        title: 'Payment Received',
        message: 'Your payment of KES 15,000 has been successfully processed.',
        time: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        type: 'payment',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 4,
        title: 'Service Update',
        message: 'Your data analysis request is now in progress.',
        time: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        type: 'service',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 5,
        title: 'Document Ready',
        message: 'Your KRA compliance certificate is now available for download.',
        time: new Date(Date.now() - 259200000).toISOString(),
        read: true,
        type: 'document',
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
    ];
  };

  const markAsRead = async (id: number) => {
    try {
      setIsUpdating(true);
      await api.patch(`/notifications/${id}/read`, {});

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );

      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    } finally {
      setIsUpdating(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsUpdating(true);
      await api.patch('/notifications/mark-all-read', {});

      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));

      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      setIsUpdating(true);
      await api.delete(`/notifications/${id}`);

      // Update local state
      setNotifications(prev => prev.filter(notification => notification.id !== id));

      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    } finally {
      setIsUpdating(false);
    }
  };

  const clearAll = async () => {
    try {
      setIsUpdating(true);
      await api.delete('/notifications/clear-all');

      // Update local state
      setNotifications([]);

      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing all:', error);
      toast.error('Failed to clear all notifications');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  const filteredNotifications =
    filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'service':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'message':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'document':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return 'Payment';
      case 'service':
        return 'Service';
      case 'message':
        return 'Message';
      case 'document':
        return 'Document';
      case 'system':
        return 'System';
      default:
        return 'General';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={markAllAsRead}
            disabled={isUpdating || unreadCount === 0}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isUpdating ? <FiLoader className="animate-spin mr-2" /> : <FiCheck className="mr-2" />}
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            disabled={isUpdating || notifications.length === 0}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FiTrash2 className="mr-2" />
            Clear all
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <FiFilter className="text-gray-400 dark:text-gray-500" />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <FiBell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No notifications
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {filter === 'unread'
                ? 'You have no unread notifications'
                : 'You have no notifications'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full mr-4 ${
                          !notification.read
                            ? 'bg-primary-100 dark:bg-primary-900'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <FiBell
                          className={
                            !notification.read
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}
                            >
                              {getTypeLabel(notification.type)}
                            </span>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(notification.time)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                          {notification.message}
                        </p>
                        <div className="mt-4 flex space-x-3">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              disabled={isUpdating}
                              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            disabled={isUpdating}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchNotifications}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center mx-auto"
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              <FiBell className="mr-2" />
              Refresh Notifications
            </>
          )}
        </button>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Debug Info</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            User: {user?.email || 'Not logged in'} | Token:{' '}
            {localStorage.getItem('token') ? 'Present' : 'Missing'} | Total: {notifications.length}{' '}
            | Unread: {unreadCount}
          </p>
          <button
            onClick={() => {
              console.log('Token:', localStorage.getItem('token'));
              console.log('User:', user);
              console.log('Notifications:', notifications);
            }}
            className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700"
          >
            Show Console Logs
          </button>
        </div>
      )}
    </div>
  );
}
