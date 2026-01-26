'use client';

import { useState } from 'react';
import { FiX, FiCreditCard, FiSmartphone, FiGlobe, FiCheckCircle, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '@/services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payment: any) => void;
  serviceId?: string;
  serviceType?: string;
  amount: number;
  title?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  serviceId,
  serviceType,
  amount,
  title = 'Complete Payment',
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank'>('mpesa');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
  });

  if (!isOpen) return null;

  // Map frontend service types to backend values
  const mapServiceTypeToBackend = (frontendType?: string): string => {
    if (!frontendType) return 'other';

    const mapping: Record<string, string> = {
      // User-friendly names to backend values
      'Data Services': 'data_service',
      'Data Service': 'data_service',
      data_service: 'data_service',
      'Business Registration': 'business_registration',
      business_registration: 'business_registration',
      'KRA Services': 'kra_service',
      'KRA Service': 'kra_service',
      kra_service: 'kra_service',
      Bookkeeping: 'bookkeeping',
      bookkeeping: 'bookkeeping',
      Subscription: 'subscription',
      subscription: 'subscription',
      Other: 'other',
      other: 'other',
    };

    return mapping[frontendType] || 'other';
  };

  // Map frontend payment methods to backend values
  const mapPaymentMethodToBackend = (method: 'mpesa' | 'card' | 'bank'): string => {
    const mapping = {
      mpesa: 'mpesa',
      card: 'card',
      bank: 'bank_transfer',
    };
    return mapping[method];
  };

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      console.log('Starting payment process...');

      // Prepare payment data for backend with correct mappings
      const paymentData = {
        service_type: mapServiceTypeToBackend(serviceType),
        amount: amount, // This is the total amount (no VAT or processing fees)
        payment_method: mapPaymentMethodToBackend(paymentMethod),
        description: `Payment for ${serviceType || 'service'}`,
      };

      // Add phone number for M-Pesa
      if (paymentMethod === 'mpesa' && formData.phoneNumber) {
        paymentData.phone_number = formData.phoneNumber;
      }

      console.log('Sending payment data to backend:', paymentData);

      // Call backend API to create payment
      const response = await api.post('/payments', paymentData);
      console.log('Backend response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Payment creation failed');
      }

      // For M-Pesa, show success immediately (backend will auto-update status)
      if (paymentMethod === 'mpesa') {
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentComplete(true);

          toast.success('Payment initiated! Check your phone for M-Pesa prompt.');

          // Give backend time to auto-update, then call onSuccess
          setTimeout(() => {
            onSuccess(response);
          }, 3500);
        }, 2000);
      } else {
        // For other methods, just show success
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentComplete(true);
          toast.success('Payment initiated successfully!');
          onSuccess(response);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);

      // Show detailed error message
      let errorMessage = 'Payment failed. Please try again.';

      if (error.response?.data) {
        console.error('Backend error details:', error.response.data);
        errorMessage = error.response.data.error || error.response.data.details || errorMessage;

        // Add specific guidance for constraint errors
        if (error.response.data.code === '23514') {
          errorMessage += ' (Invalid service type or payment method)';
        }
      }

      setIsProcessing(false);
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form based on payment method
    if (paymentMethod === 'mpesa' && !formData.phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill all card details');
        return;
      }
    }

    if (paymentMethod === 'bank' && !formData.bankName) {
      toast.error('Please select a bank');
      return;
    }

    await processPayment();
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setPaymentComplete(false);
      setPaymentMethod('mpesa');
      setFormData({
        phoneNumber: '',
        email: '',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        bankName: '',
      });
    }
  };

  // No VAT or processing fees - amount is the total amount
  const totalAmount = amount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {paymentComplete ? 'Payment Successful!' : title}
              </h3>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 disabled:opacity-50 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {paymentComplete ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Payment Received!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your payment of <strong>KES {amount.toLocaleString()}</strong> has been processed
                  successfully.
                </p>
                {serviceType && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Service: {serviceType}</p>
                )}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Reference</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    TX-{Date.now().toString().slice(-8)}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                {/* Payment Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      KES {amount.toLocaleString()}
                    </span>
                  </div>
                  {serviceType && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Service: {serviceType}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    ✓ No additional VAT or processing fees
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentMethod === 'mpesa'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-2">
                        <FiSmartphone className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        M-Pesa
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto mb-2">
                        <FiCreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Card
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentMethod === 'bank'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                      }`}
                    >
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto mb-2">
                        <FiGlobe className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Bank
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit}>
                  {paymentMethod === 'mpesa' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          M-Pesa Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="07XX XXX XXX"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                        />
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          You will receive an M-Pesa prompt on your phone to confirm the payment of
                          KES {totalAmount.toLocaleString()}.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={e => setFormData({ ...formData, cardName: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          pattern="[0-9\s]{13,19}"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={e => setFormData({ ...formData, cvv: e.target.value })}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            pattern="[0-9]{3,4}"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bank Name *
                        </label>
                        <select
                          value={formData.bankName}
                          onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select bank</option>
                          <option value="equity">Equity Bank</option>
                          <option value="kcb">KCB Bank</option>
                          <option value="coop">Co-operative Bank</option>
                          <option value="standard">Standard Chartered</option>
                          <option value="absa">Absa Bank</option>
                        </select>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Transfer <strong>KES {totalAmount.toLocaleString()}</strong> to our bank
                          account:
                        </p>
                        <div className="mt-2 text-xs">
                          <p>Bank: Data Business Solutions Ltd</p>
                          <p>Account: 1234567890</p>
                          <p>Branch: Nairobi CBD</p>
                          <p className="mt-1">Use your name as the payment reference.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-400">Service Amount</span>
                      <span className="text-gray-900 dark:text-white">
                        KES {amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4 text-green-600 dark:text-green-400">
                      <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                      <span className="text-gray-900 dark:text-white">KES 0.00</span>
                    </div>
                    <div className="flex justify-between mb-4 text-green-600 dark:text-green-400">
                      <span className="text-gray-600 dark:text-gray-400">VAT (0%)</span>
                      <span className="text-gray-900 dark:text-white">KES 0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">Total Amount</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        KES {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Pay KES ${totalAmount.toLocaleString()}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
