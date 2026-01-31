'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiCheckCircle,
  FiFileText,
  FiDownload,
  FiMail,
  FiClock,
  FiArrowLeft,
  FiPrinter,
  FiShare2,
  FiSmartphone,
  FiDollarSign,
  FiCreditCard,
} from 'react-icons/fi';
import Link from 'next/link';

interface PaymentConfirmation {
  referenceNumber: string;
  paymentReference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalWithFees: number;
  paymentDate: string;
  services: any[];
  priority: string;
  paymentMethod: 'mpesa' | 'bank' | 'card';
  paymentDetails?: {
    method: string;
    phoneNumber?: string;
    mpesaName?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    transactionId?: string;
    lastFour?: string;
    cardHolder?: string;
  };
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentRef = searchParams.get('ref');

  const [confirmation, setConfirmation] = useState<PaymentConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the confirmation from an API
    // For now, we'll simulate loading from localStorage
    const loadConfirmation = () => {
      setIsLoading(true);

      setTimeout(() => {
        if (paymentRef) {
          // Find the payment in localStorage
          const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
          const payment = serviceRequests.find((req: any) => req.paymentReference === paymentRef);

          if (payment) {
            setConfirmation({
              referenceNumber: payment.referenceNumber,
              paymentReference: payment.paymentReference,
              firstName: payment.firstName,
              lastName: payment.lastName,
              email: payment.email,
              phone: payment.phone,
              totalWithFees: payment.totalWithFees,
              paymentDate: payment.paymentDate,
              services: payment.services,
              priority: payment.priority,
              paymentMethod: payment.paymentMethod,
              paymentDetails: payment.paymentDetails,
            });
          }
        }

        setIsLoading(false);
      }, 1000);
    };

    loadConfirmation();
  }, [paymentRef]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && confirmation) {
      try {
        await navigator.share({
          title: 'Service Request Confirmation',
          text: `My service request #${confirmation.referenceNumber} has been confirmed. Total: KES ${confirmation.totalWithFees.toLocaleString()}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <FiSmartphone className="text-green-600" />;
      case 'bank':
        return <FiDollarSign className="text-blue-600" />;
      case 'card':
        return <FiCreditCard className="text-purple-600" />;
      default:
        return <FiCreditCard className="text-gray-600" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'bank':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'card':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'M-Pesa';
      case 'bank':
        return 'Bank Transfer';
      case 'card':
        return 'Card Payment';
      default:
        return 'Payment';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (!confirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your payment confirmation.</p>
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8 print:mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 print:hidden">
            <FiCheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your service request has been submitted and payment has been received.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiPrinter className="mr-2" />
              Print Receipt
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiShare2 className="mr-2" />
              Share
            </button>
            <Link
              href="/services"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse More Services
            </Link>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 print:shadow-none print:border print:border-gray-200">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service Request Confirmation</h2>
              <p className="text-gray-600">Thank you for your payment</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-600">Confirmation Number</p>
                <p className="text-xl font-bold text-blue-700">{confirmation.paymentReference}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiFileText className="mr-2" />
                Payment Details
              </h3>
              <div className="space-y-3">
                {/* Payment Method */}
                <div
                  className={`p-3 rounded-lg border ${getPaymentMethodColor(confirmation.paymentMethod)}`}
                >
                  <div className="flex items-center">
                    {getPaymentMethodIcon(confirmation.paymentMethod)}
                    <div className="ml-3">
                      <p className="font-medium">Payment Method</p>
                      <p className="text-sm">{getPaymentMethodName(confirmation.paymentMethod)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Reference:</span>
                  <span className="font-medium">{confirmation.paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Reference:</span>
                  <span className="font-medium">{confirmation.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">{formatDate(confirmation.paymentDate)}</span>
                </div>

                {/* M-Pesa Specific Details */}
                {confirmation.paymentMethod === 'mpesa' && confirmation.paymentDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">M-Pesa Number:</span>
                      <span className="font-medium">{confirmation.paymentDetails.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">M-Pesa Name:</span>
                      <span className="font-medium">{confirmation.paymentDetails.mpesaName}</span>
                    </div>
                  </>
                )}

                {/* Bank Transfer Specific Details */}
                {confirmation.paymentMethod === 'bank' && confirmation.paymentDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">{confirmation.paymentDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium">{confirmation.paymentDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">
                        {confirmation.paymentDetails.transactionId}
                      </span>
                    </div>
                  </>
                )}

                {/* Card Payment Specific Details */}
                {confirmation.paymentMethod === 'card' && confirmation.paymentDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Ending:</span>
                      <span className="font-medium">
                        **** {confirmation.paymentDetails.lastFour}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Holder:</span>
                      <span className="font-medium">{confirmation.paymentDetails.cardHolder}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>Amount Paid:</span>
                  <span className="text-green-600">
                    KES {confirmation.totalWithFees.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMail className="mr-2" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">
                    {confirmation.firstName} {confirmation.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{confirmation.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{confirmation.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Service Priority</p>
                  <p className="font-medium capitalize">{confirmation.priority}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Services</p>
                  <p className="font-medium">{confirmation.services.length} service(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiCheckCircle className="mr-2" />
              Services Requested
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {confirmation.services.map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        {service.type && (
                          <div className="text-xs text-gray-500 capitalize">{service.type}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          KES {service.unitPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          KES {service.totalPrice.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">Total Amount:</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        KES {confirmation.totalWithFees.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <FiClock className="mr-2" />
              What Happens Next?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Immediate Actions</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You will receive a confirmation email within 5 minutes</li>
                  <li>• Your request has been queued for processing</li>
                  <li>• A service representative will contact you within 24 hours</li>
                  <li>• Payment confirmation has been recorded</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Service Timeline</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Normal: 3-5 business days</li>
                  <li>• Urgent: 1-2 business days</li>
                  <li>• Express: 24 hours</li>
                  <li>• You'll receive regular updates via email</li>
                  <li>• Payment confirmation will be sent via SMS/Email</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Method Specific Information */}
          {confirmation.paymentMethod === 'mpesa' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <FiSmartphone className="mr-2" />
                M-Pesa Payment Information
              </h3>
              <div className="text-sm text-green-700">
                <p className="mb-2">Your M-Pesa payment has been processed successfully.</p>
                <ul className="space-y-1">
                  <li>• Check your phone for M-Pesa confirmation message</li>
                  <li>• Save the transaction code for future reference</li>
                  <li>
                    • Payment will reflect in your statement as "{confirmation.referenceNumber}"
                  </li>
                  <li>• For any payment issues, contact: 0712 345 678</li>
                </ul>
              </div>
            </div>
          )}

          {confirmation.paymentMethod === 'bank' && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <FiDollarSign className="mr-2" />
                Bank Transfer Information
              </h3>
              <div className="text-sm text-blue-700">
                <p className="mb-2">Your bank transfer has been received and confirmed.</p>
                <ul className="space-y-1">
                  <li>• Bank transfer typically takes 1-2 business days to reflect</li>
                  <li>• Keep your bank transaction slip for reference</li>
                  <li>• Transaction ID: {confirmation.paymentDetails?.transactionId}</li>
                  <li>• For bank transfer inquiries, email: bank@example.com</li>
                </ul>
              </div>
            </div>
          )}

          {confirmation.paymentMethod === 'card' && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <FiCreditCard className="mr-2" />
                Card Payment Information
              </h3>
              <div className="text-sm text-purple-700">
                <p className="mb-2">Your card payment has been processed successfully.</p>
                <ul className="space-y-1">
                  <li>• Payment will appear on your statement within 24 hours</li>
                  <li>• Card ending: **** {confirmation.paymentDetails?.lastFour}</li>
                  <li>• Transaction reference: {confirmation.paymentReference}</li>
                  <li>• For card payment issues, contact: cards@example.com</li>
                </ul>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-2">Need help? Contact our support team</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                <FiMail className="inline mr-1" />
                support@example.com
              </a>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <a href="tel:+254700000000" className="text-blue-600 hover:text-blue-800">
                +254 700 000 000
              </a>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <a href="tel:+254712345678" className="text-blue-600 hover:text-blue-800">
                +254 712 345 678 (WhatsApp)
              </a>
            </div>
          </div>
        </div>

        {/* Download Receipt Button */}
        <div className="text-center print:hidden">
          <button
            onClick={() => {
              // In a real app, this would generate a PDF receipt
              alert('Receipt download functionality would be implemented here');
            }}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Download Receipt (PDF)
          </button>
          <p className="mt-2 text-sm text-gray-500">
            A digital receipt has been sent to {confirmation.email}
          </p>
        </div>

        {/* Print Message */}
        <div className="text-center text-sm text-gray-500 print:hidden mt-8">
          <p>You can print this page for your records, or check your email for a digital copy.</p>
          <p className="mt-1">Thank you for choosing our services!</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #e5e7eb !important;
          }
          @page {
            margin: 20mm;
          }
        }

        /* Animation for payment method highlight */
        @keyframes highlight {
          0% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(59, 130, 246, 0.1);
          }
          100% {
            background-color: transparent;
          }
        }

        .highlight-animation {
          animation: highlight 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
