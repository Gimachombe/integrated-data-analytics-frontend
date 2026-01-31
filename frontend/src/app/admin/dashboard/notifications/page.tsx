'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiTrash2, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'service_request' | 'payment' | 'invoice' | 'status_update' | 'system' | 'promotional';
  channel: 'in_app' | 'email' | 'sms' | 'push';
  is_read: boolean;
  created_at: string;
  related_entity_type?: string;
  related_entity_id?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Service Request',
        message: 'New KRA PIN registration request from John Doe',
        type: 'service_request',
        channel: 'in_app',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Payment of KES 27,000 received from Jane Smith',
        type: 'payment',
        channel: 'email',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: '3',
        title: 'Service Completed',
        message: 'Website development service has been completed for Michael Wang',
        type: 'status_update',
        channel: 'sms',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      },
      {
        id: '4',
        title: 'New User Registered',
        message: 'New customer registered: Sarah Chege',
        type: 'system',
        channel: 'in_app',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      },
      {
        id: '5',
        title: 'System Backup',
        message: 'Daily system backup completed successfully',
        type: 'system',
        channel: 'email',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: '6',
        title: 'Invoice Generated',
        message: 'Invoice INV-2024-0006 has been generated',
        type: 'invoice',
        channel: 'in_app',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '7',
        title: 'Promotional Offer',
        message: 'New promotional offer available for Business Registration services',
        type: 'promotional',
        channel: 'push',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      },
      {
        id: '8',
        title: 'Payment Failed',
        message: 'Payment for service request SR-2024-0004 failed',
        type: 'payment',
        channel: 'sms',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, is_read: true } : notif))
    );
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification deleted');
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) {
      toast.error('No notifications selected');
      return;
    }

    setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
    toast.success(`${selectedNotifications.length} notifications deleted`);
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(notificationId => notificationId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service_request':
        return <FiBell className="text-blue-600" />;
      case 'payment':
        return <FiMail className="text-green-600" />;
      case 'invoice':
        return <FiMail className="text-purple-600" />;
      case 'status_update':
        return <FiCalendar className="text-yellow-600" />;
      case 'system':
        return <FiBell className="text-indigo-600" />;
      case 'promotional':
        return <FiPhone className="text-cyan-600" />;
      default:
        return <FiBell className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service_request':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'invoice':
        return 'bg-purple-100 text-purple-800';
      case 'status_update':
        return 'bg-yellow-100 text-yellow-800';
      case 'system':
        return 'bg-indigo-100 text-indigo-800';
      case 'promotional':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <FiMail className="text-gray-400" size={14} />;
      case 'sms':
        return <FiPhone className="text-gray-400" size={14} />;
      case 'push':
        return <FiBell className="text-gray-400" size={14} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {filteredNotifications.length} notifications
                  {filter === 'unread' && ' (unread)'}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="service_request">Service Requests</option>
                  <option value="payment">Payments</option>
                  <option value="invoice">Invoices</option>
                  <option value="system">System</option>
                </select>

                <div className="flex space-x-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark All Read
                  </button>
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                      <FiTrash2 className="mr-2" />
                      Delete Selected
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedNotifications.length === filteredNotifications.length &&
                    filteredNotifications.length > 0
                  }
                  onChange={selectAll}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-600">
                  Select all ({selectedNotifications.length} selected)
                </span>
              </div>
            </div>

            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {/* Checkbox */}
                    <div className="mr-3 mt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelectNotification(notification.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </div>

                    {/* Notification Icon */}
                    <div className="mr-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                            {!notification.is_read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          {getChannelIcon(notification.channel)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center mt-3 space-x-4">
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FiCheck className="mr-1" />
                          Mark as {notification.is_read ? 'unread' : 'read'}
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </button>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}
                        >
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <FiBell className="mx-auto text-gray-400 mb-3" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                <p className="text-gray-500">
                  {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications found`}
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.is_read).length}
                </div>
                <div className="text-sm text-gray-600">Read</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {notifications.filter(n => !n.is_read).length}
                </div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {notifications.filter(n => n.type === 'service_request').length}
                </div>
                <div className="text-sm text-gray-600">Service Requests</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
