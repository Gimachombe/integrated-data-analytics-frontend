'use client';

import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiFileText,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiCreditCard,
  FiSmartphone,
  FiBank,
} from 'react-icons/fi';
import { format } from 'date-fns';

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
  status: string;
  submittedAt: string;
}

interface ServiceRequestModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceRequestModal({
  request,
  isOpen,
  onClose,
}: ServiceRequestModalProps) {
  if (!isOpen || !request) return null;

  const getPaymentMethodIcon = () => {
    if (!request.paymentMethod) return null;

    const Icon = {
      mpesa: FiSmartphone,
      bank: FiBank,
      card: FiCreditCard,
    }[request.paymentMethod];

    if (!Icon) return null;

    const colorClass =
      request.paymentMethod === 'mpesa'
        ? 'text-green-600'
        : request.paymentMethod === 'bank'
          ? 'text-blue-600'
          : 'text-purple-600';

    return <Icon className={`${colorClass} mr-2`} size={20} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'paid_pending_processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Service Request Details</h3>
                <p className="text-sm text-gray-600">Reference: {request.referenceNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Customer Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Customer Information
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {request.firstName} {request.lastName}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        {request.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded flex items-center">
                        <FiPhone className="mr-2 text-gray-400" />
                        {request.phone}
                      </div>
                    </div>
                  </div>

                  {request.companyName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded flex items-center">
                        <FiBriefcase className="mr-2 text-gray-400" />
                        {request.companyName}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {request.kraPin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          KRA PIN
                        </label>
                        <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                          {request.kraPin}
                        </div>
                      </div>
                    )}

                    {request.idNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID/Passport Number
                        </label>
                        <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                          {request.idNumber}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Service Details */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiFileText className="mr-2" />
                  Service Details
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Type
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded capitalize">
                        {request.serviceType.replace('_', ' ')}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded capitalize">
                        {request.priority}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Request Status
                    </label>
                    <div
                      className={`text-sm font-medium px-3 py-2 rounded-full inline-block ${getStatusColor(request.status)}`}
                    >
                      {request.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submission Date & Time
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {format(new Date(request.submittedAt), 'PPpp')}
                    </div>
                  </div>

                  {request.deadline && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {format(new Date(request.deadline), 'PP')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <h4 className="text-lg font-medium text-gray-900 mt-6 mb-4 flex items-center">
                  <FiDollarSign className="mr-2" />
                  Payment Information
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded flex items-center">
                        {getPaymentMethodIcon()}
                        {request.paymentMethod ? request.paymentMethod.toUpperCase() : 'Not Paid'}
                      </div>
                    </div>

                    {request.paymentReference && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Reference
                        </label>
                        <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded font-mono">
                          {request.paymentReference}
                        </div>
                      </div>
                    )}
                  </div>

                  {request.paymentDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date & Time
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {format(new Date(request.paymentDate), 'PPpp')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiCheckCircle className="mr-2" />
                Selected Services
              </h4>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {request.services.map((service, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {service.type} • {service.details?.estimatedTime || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{service.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          KES {service.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          KES {service.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Amount */}
              <div className="mt-4 flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">KES {request.totalAmount.toLocaleString()}</span>
                  </div>

                  {request.priority === 'express' && (
                    <div className="flex justify-between py-2 text-orange-600">
                      <span>Express Fee (30%):</span>
                      <span>KES {(request.totalAmount * 0.3).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-3 border-t border-gray-200 font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      KES {request.totalWithFees.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {request.additionalNotes && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {request.additionalNotes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
