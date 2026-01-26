'use client';

import { FiDownload, FiEye, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

interface ServiceRequest {
  id: number;
  serviceType: string;
  requirements: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  reportUrl?: string;
}

const statusConfig = {
  pending: { color: 'text-yellow-600 bg-yellow-50', icon: FiClock, label: 'Pending' },
  in_progress: { color: 'text-blue-600 bg-blue-50', icon: FiClock, label: 'In Progress' },
  completed: { color: 'text-green-600 bg-green-50', icon: FiCheckCircle, label: 'Completed' },
  cancelled: { color: 'text-red-600 bg-red-50', icon: FiAlertCircle, label: 'Cancelled' },
};

const serviceTypeLabels: Record<string, string> = {
  mining: 'Data Mining',
  cleaning: 'Data Cleaning',
  collection: 'Data Collection',
  analysis: 'Data Analysis',
};

export default function ServiceRequestsTable({ requests }: { requests: ServiceRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FiEye size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests</h3>
        <p className="text-gray-500">Get started by creating your first service request.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Type
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requirements
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map(request => {
            const StatusIcon = statusConfig[request.status].icon;
            const statusClass = statusConfig[request.status];

            return (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {serviceTypeLabels[request.serviceType] || request.serviceType}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {request.requirements}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass.color}`}
                  >
                    <StatusIcon className="mr-1" size={12} />
                    {statusClass.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(request.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-900">
                      <FiEye size={18} />
                    </button>
                    {request.reportUrl && (
                      <a
                        href={request.reportUrl}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiDownload size={18} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
