import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi';

interface DashboardStatsProps {
  stats: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    totalRevenue: number;
    activeUsers: number;
    servicesThisMonth: number;
  };
  loading: boolean;
}

export default function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: <FiPackage className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-100',
      change: `${stats.servicesThisMonth} this month`,
      changeColor: 'text-green-600',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: <FiClock className="text-yellow-600" size={24} />,
      bgColor: 'bg-yellow-100',
      change: stats.pendingRequests > 0 ? 'Needs attention' : 'All clear',
      changeColor: 'text-gray-600',
    },
    {
      title: 'Completed',
      value: stats.completedRequests,
      icon: <FiCheckCircle className="text-green-600" size={24} />,
      bgColor: 'bg-green-100',
      change:
        stats.totalRequests > 0
          ? `${Math.round((stats.completedRequests / stats.totalRequests) * 100)}% completion rate`
          : 'No requests yet',
      changeColor: 'text-gray-600',
    },
    {
      title: 'Total Revenue',
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign className="text-purple-600" size={24} />,
      bgColor: 'bg-purple-100',
      change: `Revenue from ${stats.completedRequests} completed services`,
      changeColor: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <FiUsers className="text-indigo-600" size={24} />,
      bgColor: 'bg-indigo-100',
      change: `${Math.round(stats.activeUsers * 0.15)} new this week`,
      changeColor: 'text-green-600',
    },
    {
      title: 'Monthly Growth',
      value: `${stats.servicesThisMonth}`,
      icon: <FiTrendingUp className="text-cyan-600" size={24} />,
      bgColor: 'bg-cyan-100',
      change: 'Services this month',
      changeColor: 'text-green-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="flex items-center">
              <div className="p-3 bg-gray-200 rounded-lg mr-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className={`p-3 ${stat.bgColor} rounded-lg mr-4`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className={`flex items-center text-sm ${stat.changeColor}`}>
              <FiTrendingUp className="mr-1" />
              <span>{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
