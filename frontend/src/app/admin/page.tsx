'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiFileText,
  FiTrendingUp,
  FiBarChart2,
  FiShoppingCart,
  FiCalendar,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  activeServices: number;
  pendingPayments: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description?: string;
  time: string;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface UserGrowthData {
  month: string;
  users: number;
}

interface ServiceDistribution {
  name: string;
  value: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingPayments: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<ServiceDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      // Using the API service instead of fetch directly
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Fetch all data in parallel
      const [statsRes, activitiesRes, revenueRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch(`${API_URL}/api/admin/recent-activities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch(`${API_URL}/api/admin/revenue-data`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch(`${API_URL}/api/admin/user-growth`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      // Check if responses are OK
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      if (!activitiesRes.ok) throw new Error('Failed to fetch activities');
      if (!revenueRes.ok) throw new Error('Failed to fetch revenue data');
      if (!usersRes.ok) throw new Error('Failed to fetch user growth');

      const statsData = await statsRes.json();
      const activitiesData = await activitiesRes.json();
      const revenueData = await revenueRes.json();
      const userData = await usersRes.json();

      // Set data
      setStats(
        statsData || {
          totalUsers: 0,
          totalRevenue: 0,
          activeServices: 0,
          pendingPayments: 0,
        }
      );
      setRecentActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setRevenueData(Array.isArray(revenueData) ? revenueData : []);
      setUserGrowthData(Array.isArray(userData) ? userData : []);

      // Mock service distribution data for now
      setServiceDistribution([
        { name: 'Data Services', value: 35 },
        { name: 'Business Registration', value: 25 },
        { name: 'KRA Services', value: 20 },
        { name: 'Bookkeeping', value: 20 },
      ]);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);

      // Set fallback data
      setStats({
        totalUsers: 124,
        totalRevenue: 452000,
        activeServices: 18,
        pendingPayments: 7,
      });

      setRecentActivities([
        {
          id: 1,
          type: 'payment',
          title: 'Payment Received',
          description: 'KES 15,000 from Tech Solutions Ltd',
          time: '2 hours ago',
        },
        {
          id: 2,
          type: 'service',
          title: 'Service Completed',
          description: 'Data Analysis for Marketing Corp',
          time: '5 hours ago',
        },
        {
          id: 3,
          type: 'user',
          title: 'New User Registered',
          description: 'John Doe registered as client',
          time: '1 day ago',
        },
        {
          id: 4,
          type: 'payment',
          title: 'Payment Pending',
          description: 'KES 8,000 from Retail Store Inc',
          time: '2 days ago',
        },
        {
          id: 5,
          type: 'service',
          title: 'Service Started',
          description: 'Company Registration for Startup XYZ',
          time: '3 days ago',
        },
      ]);

      setRevenueData([
        { month: 'Jan', revenue: 50000 },
        { month: 'Feb', revenue: 75000 },
        { month: 'Mar', revenue: 120000 },
        { month: 'Apr', revenue: 90000 },
        { month: 'May', revenue: 150000 },
        { month: 'Jun', revenue: 180000 },
      ]);

      setUserGrowthData([
        { month: 'Jan', users: 50 },
        { month: 'Feb', users: 65 },
        { month: 'Mar', users: 80 },
        { month: 'Apr', users: 95 },
        { month: 'May', users: 110 },
        { month: 'Jun', users: 124 },
      ]);

      setServiceDistribution([
        { name: 'Data Services', value: 35 },
        { name: 'Business Registration', value: 25 },
        { name: 'KRA Services', value: 20 },
        { name: 'Bookkeeping', value: 20 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const adminCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: FiUsers,
      color: 'blue' as const,
      trend: { value: 12, isPositive: true },
      link: '/admin/users',
    },
    {
      title: 'Total Revenue',
      value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'green' as const,
      trend: { value: 8, isPositive: true },
      link: '/admin/payments',
    },
    {
      title: 'Active Services',
      value: stats.activeServices.toLocaleString(),
      icon: FiActivity,
      color: 'purple' as const,
      trend: { value: 5, isPositive: true },
      link: '/admin/services',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments.toLocaleString(),
      icon: FiShoppingCart,
      color: 'orange' as const,
      trend: { value: -2, isPositive: false },
      link: '/admin/payments?status=pending',
    },
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.firstName}. Here's what's happening.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
            Export Report
          </button>
          <button
            onClick={fetchAdminData}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map(card => (
          <Link key={card.title} href={card.link}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  <p
                    className={`text-sm mt-2 ${card.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {card.trend.isPositive ? '↑' : '↓'} {Math.abs(card.trend.value)}% from last
                    month
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    card.color === 'blue'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : card.color === 'green'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : card.color === 'purple'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  }`}
                >
                  <card.icon size={24} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-64">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                    axisLine={false}
                    tickFormatter={value => `KES ${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#F9FAFB',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={label => `Month: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Growth</h2>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-64">
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                    axisLine={false}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#F9FAFB',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [value, 'Users']}
                    labelFormatter={label => `Month: ${label}`}
                  />
                  <Bar
                    dataKey="users"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    className="hover:fill-green-500"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No user growth data available
              </div>
            )}
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Service Distribution
            </h2>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            {serviceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={entry => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#F9FAFB',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                No service distribution data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
            <Link
              href="/admin/activities"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((activity: Activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === 'payment'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : activity.type === 'service'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {activity.type === 'payment' ? (
                        <FiDollarSign size={18} />
                      ) : activity.type === 'service' ? (
                        <FiActivity size={18} />
                      ) : (
                        <FiUsers size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recent activities
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users/create">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-all">
              <FiUsers className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="font-medium text-gray-900 dark:text-white">Add New User</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create staff or client account
              </p>
            </div>
          </Link>
          <Link href="/admin/services/create">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-all">
              <FiFileText className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="font-medium text-gray-900 dark:text-white">Create Service</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add new service offering</p>
            </div>
          </Link>
          <Link href="/admin/reports">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-all">
              <FiBarChart2 className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="font-medium text-gray-900 dark:text-white">Generate Reports</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create financial reports</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
