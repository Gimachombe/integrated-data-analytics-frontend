'use client';

import { useState, useEffect } from 'react';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiSmartphone,
  FiBank,
} from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ServiceRequestModal from './ServiceRequestModal';

interface ServiceItem {
  type: string;
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details?: any;
}

interface ServiceRequest {
  id: string;
  referenceNumber: string;
  paymentReference?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  kraPin?: string;
  idNumber?: string;
  businessType?: string;
  serviceType: string;
  priority: string;
  deadline?: string;
  additionalNotes?: string;
  services: ServiceItem[];
  totalAmount: number;
  totalWithFees: number;
  paymentMethod?: 'mpesa' | 'bank' | 'card';
  paymentStatus?: string;
  paymentDate?: string;
  status: 'pending_payment' | 'paid_pending_processing' | 'processing' | 'completed' | 'cancelled';
  submittedAt: string;
}

const statusOptions = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid_pending_processing', label: 'Paid - Pending', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

const paymentMethodIcons = {
  mpesa: FiSmartphone,
  bank: FiBank,
  card: FiCreditCard,
};

export default function ServiceRequestsTable() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadServiceRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [serviceRequests, searchTerm, statusFilter]);

  const loadServiceRequests = () => {
    setLoading(true);
    try {
      // Load from localStorage (in real app, this would be from API)
      const savedRequests = localStorage.getItem('serviceRequests');
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests);
        // Ensure each request has a unique ID
        const requestsWithIds = parsedRequests.map((req: any, index: number) => ({
          ...req,
          id: req.id || `req-${Date.now()}-${index}`,
          paymentStatus:
            req.paymentStatus ||
            (req.status === 'paid_pending_processing' ? 'completed' : 'pending'),
        }));
        setServiceRequests(requestsWithIds);
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...serviceRequests];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        request =>
          request.referenceNumber.toLowerCase().includes(term) ||
          request.firstName.toLowerCase().includes(term) ||
          request.lastName.toLowerCase().includes(term) ||
          request.email.toLowerCase().includes(term) ||
          request.phone.includes(term) ||
          (request.companyName && request.companyName.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    setFilteredRequests(filtered);
  };

  const handleStatusChange = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      const updatedRequests = serviceRequests.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      );

      setServiceRequests(updatedRequests);
      localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));

      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this service request?')) {
      return;
    }

    try {
      const updatedRequests = serviceRequests.filter(request => request.id !== requestId);
      setServiceRequests(updatedRequests);
      localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));

      toast.success('Service request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const generateInvoice = (request: ServiceRequest) => {
    const doc = new jsPDF();

    // Invoice Header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Your Company Name Ltd', 105, 25, { align: 'center' });
    doc.text('123 Business Street, Nairobi, Kenya', 105, 30, { align: 'center' });
    doc.text('Phone: +254 700 000 000 | Email: info@company.co.ke', 105, 35, { align: 'center' });

    // Invoice Details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${request.referenceNumber}`, 14, 50);
    doc.text(`Date: ${format(new Date(request.submittedAt), 'dd/MM/yyyy HH:mm')}`, 14, 56);
    doc.text(`Payment Reference: ${request.paymentReference || 'N/A'}`, 14, 62);

    // Customer Information
    doc.setFontSize(14);
    doc.text('Bill To:', 14, 75);
    doc.setFontSize(10);
    doc.text(`${request.firstName} ${request.lastName}`, 14, 81);
    if (request.companyName) {
      doc.text(request.companyName, 14, 86);
    }
    doc.text(`Email: ${request.email}`, 14, 91);
    doc.text(`Phone: ${request.phone}`, 14, 96);
    if (request.kraPin) {
      doc.text(`KRA PIN: ${request.kraPin}`, 14, 101);
    }

    // Services Table
    const tableData = request.services.map((service, index) => [
      index + 1,
      service.name,
      service.quantity,
      `KES ${service.unitPrice.toLocaleString()}`,
      `KES ${service.totalPrice.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 110,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Total Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text('Subtotal:', 150, finalY);
    doc.text(`KES ${request.totalAmount.toLocaleString()}`, 180, finalY, { align: 'right' });

    if (request.priority === 'express') {
      const expressFee = request.totalAmount * 0.3;
      doc.text('Express Fee (30%):', 150, finalY + 5);
      doc.text(`KES ${expressFee.toLocaleString()}`, 180, finalY + 5, { align: 'right' });
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total Amount:', 150, finalY + 15);
    doc.text(`KES ${request.totalWithFees.toLocaleString()}`, 180, finalY + 15, { align: 'right' });
    doc.setFont(undefined, 'normal');

    // Payment Information
    doc.setFontSize(10);
    doc.text('Payment Information:', 14, finalY + 30);
    doc.text(`Status: ${request.status}`, 14, finalY + 36);
    doc.text(`Priority: ${request.priority}`, 14, finalY + 42);
    if (request.paymentMethod) {
      doc.text(`Payment Method: ${request.paymentMethod.toUpperCase()}`, 14, finalY + 48);
    }
    if (request.paymentDate) {
      doc.text(
        `Payment Date: ${format(new Date(request.paymentDate), 'dd/MM/yyyy HH:mm')}`,
        14,
        finalY + 54
      );
    }

    // Footer
    doc.setFontSize(8);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    doc.text('This is a computer-generated invoice. No signature required.', 105, 285, {
      align: 'center',
    });

    // Save the PDF
    doc.save(`invoice-${request.referenceNumber}.pdf`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const getStatusIcon = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      case 'processing':
        return <FiClock className="text-purple-500" />;
      case 'paid_pending_processing':
        return <FiCheckCircle className="text-blue-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    if (!method) return null;

    const Icon = paymentMethodIcons[method as keyof typeof paymentMethodIcons];
    if (!Icon) return null;

    const colorClass =
      method === 'mpesa'
        ? 'text-green-600'
        : method === 'bank'
          ? 'text-blue-600'
          : 'text-purple-600';

    return <Icon className={`${colorClass} ml-1`} size={14} />;
  };

  const getPaymentMethodText = (method?: string) => {
    if (!method) return 'N/A';

    switch (method) {
      case 'mpesa':
        return 'M-Pesa';
      case 'bank':
        return 'Bank';
      case 'card':
        return 'Card';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Requests</h2>
            <p className="text-gray-600">Manage and track all service requests</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reference
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-lg font-medium">No service requests found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map(request => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  {/* Reference Number */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.referenceNumber}
                    </div>
                    <div className="text-xs text-gray-500">{request.serviceType}</div>
                  </td>

                  {/* Customer Information */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.firstName} {request.lastName}
                        </div>
                        {request.companyName && (
                          <div className="text-xs text-gray-500">{request.companyName}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact Information */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiMail className="mr-2 text-gray-400" size={14} />
                        {request.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <FiPhone className="mr-2 text-gray-400" size={14} />
                        {request.phone}
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDollarSign className="text-green-600 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        KES {request.totalWithFees.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.services.length} service{request.services.length !== 1 ? 's' : ''}
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(request.paymentMethod)}
                      <span className="text-sm text-gray-900 ml-1">
                        {getPaymentMethodText(request.paymentMethod)}
                      </span>
                    </div>
                    {request.paymentStatus && (
                      <div
                        className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                          request.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {request.paymentStatus}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(request.submittedAt)}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(request.submittedAt), 'PPpp')}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <select
                        value={request.status}
                        onChange={e =>
                          handleStatusChange(request.id, e.target.value as ServiceRequest['status'])
                        }
                        className={`ml-2 text-sm font-medium rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          statusOptions.find(s => s.value === request.status)?.color ||
                          'bg-gray-100'
                        }`}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>

                      <button
                        onClick={() => generateInvoice(request)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Download Invoice"
                      >
                        <FiDownload size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Request"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Summary */}
      {filteredRequests.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing <span className="font-semibold">{filteredRequests.length}</span> of{' '}
              <span className="font-semibold">{serviceRequests.length}</span> requests
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-gray-600">Total Value:</span>
                <span className="ml-2 font-bold text-green-600">
                  KES{' '}
                  {filteredRequests
                    .reduce((sum, req) => sum + req.totalWithFees, 0)
                    .toLocaleString()}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-bold text-green-600">
                  {filteredRequests.filter(req => req.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      <ServiceRequestModal
        request={selectedRequest}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}
