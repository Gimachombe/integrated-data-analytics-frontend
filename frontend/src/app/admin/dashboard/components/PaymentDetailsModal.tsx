'use client';

import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
} from 'react-icons/fi';
import { format } from 'date-fns';

interface PaymentDetailsModalProps {
  payment: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentDetailsModal({
  payment,
  isOpen,
  onClose,
}: PaymentDetailsModalProps) {
  if (!isOpen || !payment) return null;

  const getPaymentMethodIcon = () => {
    switch (payment.paymentMethod) {
      case 'mpesa':
        return <FiSmartphone className="text-green-600" size={20} />;
      case 'card':
        return <FiCreditCard className="text-purple-600" size={20} />;
      case 'bank':
        return <FiDollarSign className="text-blue-600" size={20} />;
      default:
        return <FiDollarSign className="text-gray-600" size={20} />;
    }
  };

  const getPaymentMethodText = () => {
    switch (payment.paymentMethod) {
      case 'mpesa':
        return 'M-Pesa';
      case 'card':
        return 'Credit/Debit Card';
      case 'bank':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return payment.paymentMethod;
    }
  };

  const getStatusColor = () => {
    switch (payment.paymentStatus) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                <p className="text-sm text-gray-600">{payment.paymentReference}</p>
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
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Reference
                    </label>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                      {payment.paymentReference}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Reference
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {payment.serviceReference}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="text-lg font-bold text-green-600 bg-gray-50 p-2 rounded">
                        KES {payment.totalWithFees.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div
                        className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusColor()}`}
                      >
                        {payment.paymentStatus.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex items-center">
                      <FiUser className="mr-2 text-gray-400" />
                      {payment.customerName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {payment.customerEmail}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex items-center">
                      <FiPhone className="mr-2 text-gray-400" />
                      {payment.customerPhone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex items-center">
                    {getPaymentMethodIcon()}
                    <span className="ml-2">{getPaymentMethodText()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Date
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                  </div>
                </div>

                {payment.transactionId && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction ID
                    </label>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                      {payment.transactionId}
                    </div>
                  </div>
                )}

                {payment.priority && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Priority
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">
                      {payment.priority}
                    </div>
                  </div>
                )}

                {payment.serviceType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">
                      {payment.serviceType.replace('_', ' ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services List (if available) */}
            {payment.services && payment.services.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Services</h4>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Service
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payment.services.map((service: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{service.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{service.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            KES {service.unitPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            KES {service.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
