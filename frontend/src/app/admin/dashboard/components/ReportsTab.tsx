'use client';

import { FiFileText, FiDollarSign, FiUsers, FiDownload, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface ReportsTabProps {
  stats: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    totalRevenue: number;
    activeUsers: number;
    servicesThisMonth: number;
  };
}

export default function ReportsTab({ stats }: ReportsTabProps) {
  const monthlyData = [
    { month: 'Jan', revenue: 150000, requests: 12 },
    { month: 'Feb', revenue: 180000, requests: 15 },
    { month: 'Mar', revenue: 220000, requests: 18 },
    { month: 'Apr', revenue: 190000, requests: 16 },
    { month: 'May', revenue: 250000, requests: 20 },
    { month: 'Jun', revenue: 300000, requests: 24 },
  ];

  const serviceTypeDistribution = [
    { type: 'kra', count: 45, color: 'bg-blue-500' },
    { type: 'business', count: 32, color: 'bg-purple-500' },
    { type: 'website', count: 28, color: 'bg-indigo-500' },
    { type: 'data', count: 15, color: 'bg-cyan-500' },
  ];

  const handleGenerateReport = (type: string) => {
    toast.success(`Generating ${type} report...`);
    // Simulate report generation
    setTimeout(() => {
      toast.success(`${type} report generated successfully!`);
    }, 2000);
  };

  const handleDownloadReport = (type: string) => {
    toast.success(`Downloading ${type} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          <button
            onClick={() => handleGenerateReport('monthly')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
          >
            <FiDownload className="mr-2" />
            Download Report
          </button>
        </div>
        <div className="space-y-4">
          {monthlyData.map(item => (
            <div key={item.month} className="flex items-center">
              <div className="w-16 text-sm text-gray-600">{item.month}</div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">KES {item.revenue.toLocaleString()}</span>
                  <span className="text-gray-500">{item.requests} requests</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(item.revenue / 350000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Type Distribution</h3>
          <div className="space-y-4">
            {serviceTypeDistribution.map(service => (
              <div key={service.type} className="flex items-center">
                <div className="w-32">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {service.type}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{service.count} requests</span>
                    <span>{((service.count / 120) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${service.color}`}
                      style={{ width: `${(service.count / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Reports */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate Reports</h3>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => handleGenerateReport('monthly')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <FiFileText className="text-blue-600 mr-3" size={24} />
                <div>
                  <div className="font-medium text-gray-900">Monthly Report</div>
                  <div className="text-sm text-gray-500">Generate monthly performance report</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleGenerateReport('revenue')}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <FiDollarSign className="text-green-600 mr-3" size={24} />
                <div>
                  <div className="font-medium text-gray-900">Revenue Report</div>
                  <div className="text-sm text-gray-500">Detailed revenue and payment report</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleGenerateReport('customer')}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <FiUsers className="text-purple-600 mr-3" size={24} />
                <div>
                  <div className="font-medium text-gray-900">Customer Report</div>
                  <div className="text-sm text-gray-500">Customer analytics and insights</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleGenerateReport('service')}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <FiTrendingUp className="text-indigo-600 mr-3" size={24} />
                <div>
                  <div className="font-medium text-gray-900">Service Performance</div>
                  <div className="text-sm text-gray-500">Service usage and performance metrics</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              KES {stats.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Completed Requests</div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedRequests}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 mb-1">Active Users</div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg">
            <div className="text-sm text-cyan-600 mb-1">This Month</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.servicesThisMonth} services
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
