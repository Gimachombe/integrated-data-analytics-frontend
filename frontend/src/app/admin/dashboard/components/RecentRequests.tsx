import { FiArrowRight, FiFileText, FiGlobe, FiDatabase } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from '@/components/ui/StatusBadge';
import ServiceTypeIcon from '@/components/ui/ServiceTypeIcon';

interface RecentRequest {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  serviceType: 'kra' | 'business' | 'website' | 'data';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  submittedAt: string;
}

interface RecentRequestsProps {
  requests: RecentRequest[];
  loading: boolean;
  onStatusUpdate: (id: string, status: string) => void;
}

export default function RecentRequests({ requests, loading, onStatusUpdate }: RecentRequestsProps) {
  const handleViewAll = () => {
    // Navigate to full requests page
    document.querySelector('button[onclick*="requests"]')?.dispatchEvent(new MouseEvent('click'));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md animate-pulse">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Recent Service Requests</h3>
        <button
          onClick={handleViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View all requests
          <FiArrowRight className="ml-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length > 0 ? (
              requests.slice(0, 5).map(request => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {request.referenceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.firstName} {request.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{request.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ServiceTypeIcon type={request.serviceType} />
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {request.serviceType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      KES {request.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(request.submittedAt), { addSuffix: true })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FiFileText className="text-gray-400 mb-2" size={32} />
                    <p>No service requests yet</p>
                    <p className="text-sm">Service requests will appear here</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
