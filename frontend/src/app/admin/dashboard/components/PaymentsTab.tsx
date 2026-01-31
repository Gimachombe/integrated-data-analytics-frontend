'use client';

import { useState, useEffect } from 'react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiSmartphone,
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiMail,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import PaymentDetailsModal from './PaymentDetailsModal';

interface Payment {
  id: string;
  paymentReference: string;
  serviceReference: string;
  amount: number;
  totalWithFees: number;
  currency: string;
  paymentMethod: 'mpesa' | 'card' | 'bank' | 'cash';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  completedAt?: string;
  serviceType?: string;
  priority?: string;
  services?: any[];
  paymentData?: any;
}

export default function PaymentsTab() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load payments from localStorage (service requests with payments)
  const loadPayments = () => {
    setLoading(true);
    try {
      // Load service requests that have payments
      const savedRequests = localStorage.getItem('serviceRequests');
      if (savedRequests) {
        const serviceRequests = JSON.parse(savedRequests);

        // Filter requests that have payment information
        const paymentRequests = serviceRequests.filter(
          (request: any) => request.paymentStatus || request.paymentMethod
        );

        // Convert service requests to payment format
        const formattedPayments: Payment[] = paymentRequests.map((request: any) => ({
          id: request.id || `payment-${Date.now()}`,
          paymentReference:
            request.paymentReference ||
            `PAY-${request.referenceNumber?.split('-')[1] || 'UNKNOWN'}`,
          serviceReference: request.referenceNumber,
          amount: request.totalAmount || 0,
          totalWithFees: request.totalWithFees || request.totalAmount || 0,
          currency: 'KES',
          paymentMethod: request.paymentMethod || 'cash',
          paymentStatus:
            request.paymentStatus ||
            (request.status === 'paid_pending_processing' ? 'completed' : 'pending'),
          transactionId:
            request.paymentDetails?.transactionId || request.paymentData?.transactionId,
          customerName: `${request.firstName} ${request.lastName}`,
          customerEmail: request.email,
          customerPhone: request.phone,
          createdAt: request.paymentDate || request.submittedAt,
          completedAt: request.paymentDate,
          serviceType: request.serviceType,
          priority: request.priority,
          services: request.services,
          paymentData: request.paymentData || request.paymentDetails,
        }));

        setPayments(formattedPayments);
        setFilteredPayments(formattedPayments);
      } else {
        // If no data in localStorage, use mock data
        const mockPayments: Payment[] = [
          {
            id: '1',
            paymentReference: 'PAY-123456',
            serviceReference: 'SR-123456',
            amount: 5500,
            totalWithFees: 5500,
            currency: 'KES',
            paymentMethod: 'mpesa',
            paymentStatus: 'completed',
            transactionId: 'MPESA123456',
            customerName: 'John Doe',
            customerEmail: 'john.doe@example.com',
            customerPhone: '+254712345678',
            createdAt: '2024-01-20T10:30:00Z',
            completedAt: '2024-01-20T10:35:00Z',
            serviceType: 'kra',
            priority: 'normal',
            services: [
              { name: 'KRA PIN Registration', quantity: 1, unitPrice: 1500, totalPrice: 1500 },
              { name: 'Tax Returns Filing', quantity: 2, unitPrice: 2000, totalPrice: 4000 },
            ],
          },
          {
            id: '2',
            paymentReference: 'PAY-123457',
            serviceReference: 'SR-123457',
            amount: 15000,
            totalWithFees: 19500,
            currency: 'KES',
            paymentMethod: 'card',
            paymentStatus: 'completed',
            customerName: 'Jane Smith',
            customerEmail: 'jane.smith@example.com',
            customerPhone: '+254723456789',
            createdAt: '2024-01-21T14:45:00Z',
            completedAt: '2024-01-21T14:50:00Z',
            serviceType: 'business',
            priority: 'express',
            services: [
              { name: 'Company Registration', quantity: 1, unitPrice: 15000, totalPrice: 15000 },
            ],
          },
          {
            id: '3',
            paymentReference: 'PAY-123458',
            serviceReference: 'SR-123458',
            amount: 8500,
            totalWithFees: 8500,
            currency: 'KES',
            paymentMethod: 'bank',
            paymentStatus: 'completed',
            transactionId: 'BANK789012',
            customerName: 'Robert Johnson',
            customerEmail: 'robert.j@example.com',
            customerPhone: '+254734567890',
            createdAt: '2024-01-22T09:15:00Z',
            completedAt: '2024-01-22T09:20:00Z',
            serviceType: 'kra',
            priority: 'urgent',
            services: [
              { name: 'VAT Registration', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
              { name: 'Tax Clearance', quantity: 1, unitPrice: 3500, totalPrice: 3500 },
            ],
          },
        ];

        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, statusFilter, methodFilter, payments]);

  const filterPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        payment =>
          payment.paymentReference.toLowerCase().includes(term) ||
          payment.serviceReference.toLowerCase().includes(term) ||
          payment.customerName.toLowerCase().includes(term) ||
          payment.customerEmail.toLowerCase().includes(term) ||
          payment.customerPhone.includes(term) ||
          (payment.transactionId && payment.transactionId.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentStatus === statusFilter);
    }

    // Apply method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredPayments(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterPayments();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      'Payment Reference',
      'Service Reference',
      'Customer Name',
      'Email',
      'Phone',
      'Amount',
      'Method',
      'Status',
      'Date',
      'Transaction ID',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment =>
        [
          payment.paymentReference,
          payment.serviceReference,
          `"${payment.customerName}"`,
          payment.customerEmail,
          payment.customerPhone,
          payment.totalWithFees,
          payment.paymentMethod,
          payment.paymentStatus,
          format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm'),
          payment.transactionId || '',
        ].join(',')
      ),
    ].join('\n');

    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Payments exported successfully');
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: string) => {
    try {
      // Update payment status in localStorage
      const savedRequests = localStorage.getItem('serviceRequests');
      if (savedRequests) {
        const serviceRequests = JSON.parse(savedRequests);
        const updatedRequests = serviceRequests.map((request: any) => {
          if (
            request.id === paymentId ||
            request.paymentReference?.includes(paymentId.split('-')[1])
          ) {
            return {
              ...request,
              paymentStatus: newStatus,
              status:
                newStatus === 'completed'
                  ? 'paid_pending_processing'
                  : newStatus === 'failed'
                    ? 'cancelled'
                    : request.status,
            };
          }
          return request;
        });

        localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));

        // Update local state
        setPayments(prev =>
          prev.map(p => (p.id === paymentId ? { ...p, paymentStatus: newStatus as any } : p))
        );

        toast.success(`Payment status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <FiSmartphone className="text-green-600" size={16} />;
      case 'card':
        return <FiCreditCard className="text-purple-600" size={16} />;
      case 'bank':
        return <FiDollarSign className="text-blue-600" size={16} />;
      default:
        return <FiDollarSign className="text-gray-600" size={16} />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'M-Pesa';
      case 'card':
        return 'Card';
      case 'bank':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md animate-pulse">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Header with Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Management</h3>
            <p className="text-sm text-gray-600">Track and manage all customer payments</p>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={methodFilter}
                onChange={e => setMethodFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Methods</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </form>

            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
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
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.length > 0 ? (
              filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  {/* Reference */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {payment.paymentReference}
                    </div>
                    <div className="text-xs text-gray-500">Service: {payment.serviceReference}</div>
                    {payment.transactionId && (
                      <div className="text-xs text-gray-500">Txn: {payment.transactionId}</div>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600" size={16} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.customerName}
                        </div>
                        <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                        <div className="text-xs text-gray-500">{payment.customerPhone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDollarSign className="text-green-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          KES {payment.totalWithFees.toLocaleString()}
                        </div>
                        {payment.priority === 'express' && (
                          <div className="text-xs text-orange-600">Express (+30%)</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getPaymentMethodText(payment.paymentMethod)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}
                      >
                        {payment.paymentStatus.charAt(0).toUpperCase() +
                          payment.paymentStatus.slice(1)}
                      </span>
                      {payment.serviceType && (
                        <div className="text-xs text-gray-500 capitalize">
                          {payment.serviceType.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiCalendar className="mr-2 text-gray-400" size={14} />
                      <div>
                        <div>{format(new Date(payment.createdAt), 'dd/MM/yyyy')}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(payment.createdAt), 'HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>

                      {payment.paymentStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(payment.id, 'completed')}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Mark as Completed"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(payment.id, 'failed')}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Mark as Failed"
                          >
                            <FiXCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FiDollarSign className="text-gray-400 mb-2" size={32} />
                    <p className="text-lg font-medium">No payments found</p>
                    <p className="text-sm">Try adjusting your search filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {filteredPayments.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing <span className="font-semibold">{filteredPayments.length}</span> of{' '}
              <span className="font-semibold">{payments.length}</span> payments
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-gray-600">Total Value:</span>
                <span className="ml-2 font-bold text-green-600">
                  KES{' '}
                  {filteredPayments
                    .reduce((sum, payment) => sum + payment.totalWithFees, 0)
                    .toLocaleString()}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-bold text-green-600">
                  {filteredPayments.filter(p => p.paymentStatus === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
}
