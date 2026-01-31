'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiCreditCard,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiSmartphone,
  FiBank,
  FiDollarSign,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ServiceRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  kraPin: string;
  idNumber: string;
  businessType: string;
  serviceType: string;
  priority: string;
  deadline?: string;
  additionalNotes: string;
  services: any[];
  totalAmount: number;
  totalWithFees: number;
  priorityMultiplier: number;
  referenceNumber: string;
  submittedAt: string;
  status: string;
}

type PaymentMethod = 'mpesa' | 'bank' | 'card';

interface CardPaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface MpesaPaymentData {
  phoneNumber: string;
  mpesaName: string;
}

interface BankPaymentData {
  bankName: string;
  accountNumber: string;
  accountName: string;
  transactionId: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Payment data states
  const [cardData, setCardData] = useState<CardPaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [mpesaData, setMpesaData] = useState<MpesaPaymentData>({
    phoneNumber: '',
    mpesaName: '',
  });

  const [bankData, setBankData] = useState<BankPaymentData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    transactionId: '',
  });

  useEffect(() => {
    // Load service request from localStorage
    const loadServiceRequest = () => {
      const requestStr = localStorage.getItem('serviceRequestForPayment');
      if (!requestStr) {
        toast.error('No service request found. Please fill the form first.');
        router.push('/services/request');
        return;
      }

      try {
        const request = JSON.parse(requestStr);
        setServiceRequest(request);
        // Pre-fill M-Pesa phone number from request
        if (request.phone) {
          setMpesaData(prev => ({ ...prev, phoneNumber: request.phone }));
        }
        if (request.firstName && request.lastName) {
          setMpesaData(prev => ({
            ...prev,
            mpesaName: `${request.firstName} ${request.lastName}`,
          }));
          setBankData(prev => ({
            ...prev,
            accountName: `${request.firstName} ${request.lastName}`,
          }));
        }
      } catch (error) {
        console.error('Error loading service request:', error);
        toast.error('Failed to load service request.');
        router.push('/services/request');
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceRequest();
  }, [router]);

  const handleCardDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setCardData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      let formattedValue = value;
      if (value.length === 2 && !value.includes('/')) {
        formattedValue = value + '/';
      }
      setCardData(prev => ({ ...prev, [name]: formattedValue.slice(0, 5) }));
      return;
    }

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleMpesaDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMpesaData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankData(prev => ({ ...prev, [name]: value }));
  };

  const validatePaymentData = () => {
    if (selectedMethod === 'card') {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }

      if (!cardData.cardHolder) {
        toast.error('Please enter card holder name');
        return false;
      }

      if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }

      if (!cardData.cvv || cardData.cvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return false;
      }
    }

    if (selectedMethod === 'mpesa') {
      if (!mpesaData.phoneNumber || !/^0[17]\d{8}$/.test(mpesaData.phoneNumber)) {
        toast.error('Please enter a valid Kenyan phone number (07XXXXXXXX or 01XXXXXXXX)');
        return false;
      }

      if (!mpesaData.mpesaName || mpesaData.mpesaName.length < 2) {
        toast.error('Please enter the name registered with M-Pesa');
        return false;
      }
    }

    if (selectedMethod === 'bank') {
      if (!bankData.bankName) {
        toast.error('Please select bank name');
        return false;
      }

      if (!bankData.accountNumber || bankData.accountNumber.length < 5) {
        toast.error('Please enter a valid account number');
        return false;
      }

      if (!bankData.accountName || bankData.accountName.length < 2) {
        toast.error('Please enter account name');
        return false;
      }

      if (!bankData.transactionId || bankData.transactionId.length < 3) {
        toast.error('Please enter bank transaction ID');
        return false;
      }
    }

    return true;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceRequest) {
      toast.error('Service request not found');
      return;
    }

    if (!validatePaymentData()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate payment reference
      const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      // Create payment record based on selected method
      let paymentMethodDetails;
      let paymentData;

      switch (selectedMethod) {
        case 'card':
          paymentMethodDetails = {
            method: 'card',
            lastFour: cardData.cardNumber.slice(-4).replace(/\s/g, ''),
            cardHolder: cardData.cardHolder,
          };
          paymentData = {
            ...cardData,
            cardNumber: `**** **** **** ${cardData.cardNumber.slice(-4).replace(/\s/g, '')}`,
          };
          break;
        case 'mpesa':
          paymentMethodDetails = {
            method: 'mpesa',
            phoneNumber: mpesaData.phoneNumber,
            mpesaName: mpesaData.mpesaName,
          };
          paymentData = mpesaData;
          break;
        case 'bank':
          paymentMethodDetails = {
            method: 'bank',
            bankName: bankData.bankName,
            accountNumber: `****${bankData.accountNumber.slice(-4)}`,
            accountName: bankData.accountName,
            transactionId: bankData.transactionId,
          };
          paymentData = bankData;
          break;
      }

      // Create complete service request record with payment info
      const completeServiceRequest = {
        ...serviceRequest,
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: selectedMethod,
        paymentDetails: paymentMethodDetails,
        paymentData: paymentData,
        paymentReference,
        paymentStatus: 'completed',
        paymentDate: new Date().toISOString(),
        status: 'paid_pending_processing',
        submittedAt: new Date().toISOString(),
      };

      // Save to localStorage - ensure we're saving the complete record
      const existingRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
      existingRequests.push(completeServiceRequest);
      localStorage.setItem('serviceRequests', JSON.stringify(existingRequests));

      // Also save a separate payment record for admin dashboard
      const paymentRecord = {
        id: `payment-${Date.now()}`,
        paymentReference,
        serviceReference: serviceRequest.referenceNumber,
        amount: serviceRequest.totalAmount,
        totalWithFees: serviceRequest.totalWithFees,
        currency: 'KES',
        paymentMethod: selectedMethod,
        paymentStatus: 'completed',
        transactionId:
          selectedMethod === 'bank'
            ? bankData.transactionId
            : selectedMethod === 'mpesa'
              ? `MPESA-${paymentReference}`
              : `CARD-${paymentReference}`,
        customerName: `${serviceRequest.firstName} ${serviceRequest.lastName}`,
        customerEmail: serviceRequest.email,
        customerPhone: serviceRequest.phone,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        serviceType: serviceRequest.serviceType,
        priority: serviceRequest.priority,
        services: serviceRequest.services,
      };

      const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      existingPayments.push(paymentRecord);
      localStorage.setItem('payments', JSON.stringify(existingPayments));

      // Clear the pending request
      localStorage.removeItem('serviceRequestForPayment');

      // Show success message
      toast.success(
        `Payment successful via ${selectedMethod.toUpperCase()}! Your service request has been submitted.`
      );

      // Redirect to confirmation page
      router.push(`/services/request/confirmation?ref=${paymentReference}`);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    router.push('/services/request');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return null;
  }

  const banks = [
    'Equity Bank',
    'KCB Bank',
    'Co-operative Bank',
    'Standard Chartered',
    'Absa Bank',
    'NCBA Bank',
    'DTB Bank',
    'Stanbic Bank',
    'Family Bank',
    'I&M Bank',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Request Form
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h1>
          <p className="text-gray-600">
            Select your preferred payment method and complete the payment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <FiLock className="text-green-600 mr-3" size={24} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
                  <p className="text-sm text-gray-600">Your payment is encrypted and secure</p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* M-Pesa Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mpesa')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'mpesa'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-3 rounded-full mb-2 ${
                          selectedMethod === 'mpesa' ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <FiSmartphone
                          className={`text-xl ${
                            selectedMethod === 'mpesa' ? 'text-green-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          selectedMethod === 'mpesa' ? 'text-green-700' : 'text-gray-700'
                        }`}
                      >
                        M-Pesa
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Mobile Money</span>
                    </div>
                  </button>

                  {/* Bank Transfer Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'bank'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-3 rounded-full mb-2 ${
                          selectedMethod === 'bank' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        <FiBank
                          className={`text-xl ${
                            selectedMethod === 'bank' ? 'text-blue-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          selectedMethod === 'bank' ? 'text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        Bank Transfer
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Direct Bank</span>
                    </div>
                  </button>

                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-3 rounded-full mb-2 ${
                          selectedMethod === 'card' ? 'bg-purple-100' : 'bg-gray-100'
                        }`}
                      >
                        <FiCreditCard
                          className={`text-xl ${
                            selectedMethod === 'card' ? 'text-purple-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          selectedMethod === 'card' ? 'text-purple-700' : 'text-gray-700'
                        }`}
                      >
                        Card Payment
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Credit/Debit</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit}>
                {/* M-Pesa Payment Form */}
                {selectedMethod === 'mpesa' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <FiSmartphone className="text-green-600 mr-2" />
                        <h3 className="font-semibold text-green-800">
                          M-Pesa Payment Instructions
                        </h3>
                      </div>
                      <ol className="mt-2 text-sm text-green-700 list-decimal list-inside space-y-1">
                        <li>Ensure you have sufficient funds in your M-Pesa account</li>
                        <li>You will receive a prompt on your phone to confirm payment</li>
                        <li>Enter your M-Pesa PIN when prompted</li>
                        <li>Wait for confirmation message</li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        M-Pesa Phone Number *
                      </label>
                      <div className="relative">
                        <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={mpesaData.phoneNumber}
                          onChange={handleMpesaDataChange}
                          placeholder="07XXXXXXXX or 01XXXXXXXX"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Enter the phone number registered with M-Pesa
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name as Registered with M-Pesa *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="mpesaName"
                          value={mpesaData.mpesaName}
                          onChange={handleMpesaDataChange}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {selectedMethod === 'bank' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <FiBank className="text-blue-600 mr-2" />
                        <h3 className="font-semibold text-blue-800">Bank Transfer Instructions</h3>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-blue-800">Bank:</span>
                          <span className="ml-2 text-blue-700">Equity Bank Kenya</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-blue-800">Account Name:</span>
                          <span className="ml-2 text-blue-700">Your Company Name Ltd</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-blue-800">Account Number:</span>
                          <span className="ml-2 text-blue-700">1234567890</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-blue-800">Swift Code:</span>
                          <span className="ml-2 text-blue-700">EQBLKENA</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-blue-800">Branch:</span>
                          <span className="ml-2 text-blue-700">Nairobi CBD</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bank Name *
                      </label>
                      <select
                        name="bankName"
                        value={bankData.bankName}
                        onChange={e => handleBankDataChange(e as any)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select your bank</option>
                        {banks.map(bank => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Account Number *
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={bankData.accountNumber}
                          onChange={handleBankDataChange}
                          placeholder="e.g., 123456789"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Name *
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={bankData.accountName}
                          onChange={handleBankDataChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Transaction ID / Reference *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={bankData.transactionId}
                        onChange={handleBankDataChange}
                        placeholder="e.g., TXN123456789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter the transaction reference from your bank transfer
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Payment Form */}
                {selectedMethod === 'card' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <FiShield className="text-purple-600 mr-2" />
                        <h3 className="font-semibold text-purple-800">Secure Card Payment</h3>
                      </div>
                      <p className="mt-2 text-sm text-purple-700">
                        Your card details are encrypted and secure. We never store your full card
                        information.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardDataChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Holder Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="cardHolder"
                          value={cardData.cardHolder}
                          onChange={handleCardDataChange}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleCardDataChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardDataChange}
                            placeholder="123"
                            maxLength={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : selectedMethod === 'mpesa'
                          ? 'bg-green-600 hover:bg-green-700'
                          : selectedMethod === 'bank'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" size={20} />
                        Pay KES {serviceRequest.totalWithFees.toLocaleString()} via{' '}
                        {selectedMethod === 'mpesa'
                          ? 'M-Pesa'
                          : selectedMethod === 'bank'
                            ? 'Bank Transfer'
                            : 'Card'}
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      <FiLock className="inline mr-1" size={12} />
                      Your payment is secure and encrypted.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Methods Info */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Accepted Payment Methods</h3>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-lg border ${
                    selectedMethod === 'mpesa' ? 'border-green-300 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded ${
                        selectedMethod === 'mpesa' ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <FiSmartphone
                        className={selectedMethod === 'mpesa' ? 'text-green-600' : 'text-gray-600'}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500">Instant</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    selectedMethod === 'bank' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded ${
                        selectedMethod === 'bank' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}
                    >
                      <FiBank
                        className={selectedMethod === 'bank' ? 'text-blue-600' : 'text-gray-600'}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-xs text-gray-500">1-2 business days</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    selectedMethod === 'card' ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded ${
                        selectedMethod === 'card' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}
                    >
                      <FiCreditCard
                        className={selectedMethod === 'card' ? 'text-purple-600' : 'text-gray-600'}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Card Payment</p>
                      <p className="text-xs text-gray-500">Instant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Reference Number */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="font-mono font-bold text-blue-700">
                  {serviceRequest.referenceNumber}
                </p>
              </div>

              {/* Selected Payment Method */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Selected Payment Method</h3>
                <div
                  className={`p-3 rounded-lg flex items-center ${
                    selectedMethod === 'mpesa'
                      ? 'bg-green-50 border border-green-200'
                      : selectedMethod === 'bank'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-purple-50 border border-purple-200'
                  }`}
                >
                  {selectedMethod === 'mpesa' ? (
                    <FiSmartphone className="text-green-600 mr-3" />
                  ) : selectedMethod === 'bank' ? (
                    <FiBank className="text-blue-600 mr-3" />
                  ) : (
                    <FiCreditCard className="text-purple-600 mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedMethod === 'mpesa'
                        ? 'M-Pesa'
                        : selectedMethod === 'bank'
                          ? 'Bank Transfer'
                          : 'Card Payment'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedMethod === 'mpesa'
                        ? 'Mobile Money'
                        : selectedMethod === 'bank'
                          ? 'Bank Account'
                          : 'Credit/Debit Card'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    {serviceRequest.firstName} {serviceRequest.lastName}
                  </p>
                  <p>{serviceRequest.email}</p>
                  <p>{serviceRequest.phone}</p>
                  {serviceRequest.companyName && <p>{serviceRequest.companyName}</p>}
                </div>
              </div>

              {/* Service Summary */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Service Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-medium">{serviceRequest.services.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-medium capitalize">{serviceRequest.priority}</span>
                  </div>
                  {serviceRequest.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">
                        {new Date(serviceRequest.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      KES {serviceRequest.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {serviceRequest.priority === 'express' && (
                    <div className="flex justify-between text-orange-600">
                      <span>Express Fee (30%):</span>
                      <span>KES {(serviceRequest.totalAmount * 0.3).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total Amount:</span>
                    <span
                      className={`flex items-center ${
                        selectedMethod === 'mpesa'
                          ? 'text-green-600'
                          : selectedMethod === 'bank'
                            ? 'text-blue-600'
                            : 'text-purple-600'
                      }`}
                    >
                      <FiDollarSign className="mr-1" />
                      KES {serviceRequest.totalWithFees.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Services List */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Selected Services</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {serviceRequest.services.map((service, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900 truncate">{service.name}</p>
                      <div className="flex justify-between text-gray-600">
                        <span>
                          {service.quantity} × KES {service.unitPrice.toLocaleString()}
                        </span>
                        <span>KES {service.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
