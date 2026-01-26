'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiActivity,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
  FiShoppingCart,
  FiGlobe,
  FiRefreshCw,
} from 'react-icons/fi';
import ServiceCard from '@/components/ServiceCard';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalServices: number;
  pendingServices: number;
  completedServices: number;
  activeRequests: number;
  totalRevenue: number;
  newUsers: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  status: string;
  date: string;
  description?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    pendingServices: 0,
    completedServices: 0,
    activeRequests: 0,
    totalRevenue: 0,
    newUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);

      if (user?.role === 'admin') {
        // Admin dashboard data
        const [statsData, activitiesData, revenueData, userGrowthData] = await Promise.all([
          api.getDashboardStats(),
          api.getRecentActivities(),
          api.getRevenueData(),
          api.getUserGrowthData(),
        ]);

        setStats(statsData);
        setRecentActivity(activitiesData || []);
        setRevenueData(revenueData || []);
        setUserGrowthData(userGrowthData || []);
      } else {
        // Client dashboard data
        const [services, payments, activities] = await Promise.all([
          api.getDataServices(),
          api.getPayments(),
          api.getRecentActivities(),
        ]);

        // Calculate stats from data
        const totalServices = services?.length || 0;
        const pendingServices = services?.filter((s: any) => s.status === 'pending')?.length || 0;
        const completedServices =
          services?.filter((s: any) => s.status === 'completed')?.length || 0;
        const totalRevenue =
          payments?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;

        setStats({
          totalServices,
          pendingServices,
          completedServices,
          activeRequests: pendingServices,
          totalRevenue,
          newUsers: 0,
        });

        setRecentActivity(activities || []);

        // Mock revenue data for clients
        setRevenueData([
          { month: 'Jan', revenue: 5000 },
          { month: 'Feb', revenue: 8000 },
          { month: 'Mar', revenue: 12000 },
          { month: 'Apr', revenue: 15000 },
          { month: 'May', revenue: 18000 },
          { month: 'Jun', revenue: 22000 },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');

      // Fallback to mock data
      setMockData();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const setMockData = () => {
    const mockStats = {
      totalServices: 12,
      pendingServices: 3,
      completedServices: 8,
      activeRequests: 1,
      totalRevenue: 45200,
      newUsers: 5,
    };
    setStats(mockStats);

    const mockActivity: Activity[] = [
      {
        id: 1,
        type: 'data_service',
        title: 'Data Analysis Request',
        status: 'completed',
        date: new Date().toISOString(),
        description: 'Customer behavior analysis completed',
      },
      {
        id: 2,
        type: 'business_reg',
        title: 'Company Registration',
        status: 'in_progress',
        date: new Date().toISOString(),
        description: 'Tech Solutions Ltd registration in progress',
      },
      {
        id: 3,
        type: 'kra_service',
        title: 'Tax Filing',
        status: 'pending',
        date: new Date().toISOString(),
        description: 'Q4 2023 tax returns pending',
      },
    ];
    setRecentActivity(mockActivity);

    const mockRevenueData = [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 12000 },
      { month: 'Apr', revenue: 22000 },
      { month: 'May', revenue: 25000 },
      { month: 'Jun', revenue: 30000 },
    ];
    setRevenueData(mockRevenueData);

    const mockUserGrowthData = [
      { month: 'Jan', users: 50 },
      { month: 'Feb', users: 75 },
      { month: 'Mar', users: 90 },
      { month: 'Apr', users: 120 },
      { month: 'May', users: 150 },
      { month: 'Jun', users: 180 },
    ];
    setUserGrowthData(mockUserGrowthData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const services = [
    {
      title: 'Data Services',
      description: 'Data mining, cleaning, collection, and analysis',
      href: '/data-services',
      icon: FiActivity,
      color: 'blue' as const,
    },
    {
      title: 'Business Registration',
      description: 'Company and business name registration',
      href: '/business-registration',
      icon: FiFileText,
      color: 'green' as const,
    },
    {
      title: 'KRA Services',
      description: 'PIN registration, tax filing, compliance',
      href: '/kra-services',
      icon: FiCheckCircle,
      color: 'purple' as const,
    },
    {
      title: 'Bookkeeping',
      description: 'Bookkeeping and audit preparation',
      href: '/bookkeeping',
      icon: FiClock,
      color: 'orange' as const,
    },
  ];

  const adminServices =
    user?.role === 'admin'
      ? [
          {
            title: 'User Management',
            description: 'Manage users and permissions',
            href: '/admin/users',
            icon: FiUsers,
            color: 'red' as const,
          },
          {
            title: 'Analytics',
            description: 'View platform analytics',
            href: '/admin/analytics',
            icon: FiTrendingUp,
            color: 'purple' as const,
          },
        ]
      : [];

  const allServices = [...services, ...adminServices];

  const statsCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: FiActivity,
      color: 'blue' as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Pending Services',
      value: stats.pendingServices,
      icon: FiClock,
      color: 'yellow' as const,
      trend: { value: 5, isPositive: false },
    },
    {
      title: 'Completed Services',
      value: stats.completedServices,
      icon: FiCheckCircle,
      color: 'green' as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Total Revenue',
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'purple' as const,
      trend: { value: 15, isPositive: true },
    },
  ];

  if (user?.role === 'admin') {
    statsCards.push(
      {
        title: 'Active Requests',
        value: stats.activeRequests,
        icon: FiShoppingCart,
        color: 'orange' as const,
        trend: { value: 3, isPositive: true },
      },
      {
        title: 'New Users',
        value: stats.newUsers,
        icon: FiUsers,
        color: 'red' as const,
        trend: { value: 20, isPositive: true },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's what's happening with your services today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>System Status: Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {statsCards.map(card => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
          />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Export
                </button>
              </div>
            </div>
            <div className="h-64">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
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
                    <Bar
                      dataKey="revenue"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      className="hover:fill-primary-500"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No revenue data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <Link
                href="/notifications"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="h-64 overflow-y-auto pr-2">
              <RecentActivity activities={recentActivity} />
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart (Admin only) */}
      {user?.role === 'admin' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Growth</h2>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mt-2 sm:mt-0">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-64">
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
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
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No user growth data available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Services */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Services</h2>
          <Link
            href="/services"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
          >
            <span>View all services</span>
            <FiGlobe className="ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allServices.map(service => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}
