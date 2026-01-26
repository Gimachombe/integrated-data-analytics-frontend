'use client';

import { useState, useEffect } from 'react';
import {
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiLoader,
  FiRefreshCw,
  FiEye,
  FiX,
  FiFileText,
  FiCalendar,
  FiClock as FiTime,
} from 'react-icons/fi';
import PaymentModal from '@/components/PaymentModal';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Payment {
  date_full: string;
  datetime: string;
  id: string;
  amount: number;
  service: string;
  service_type: string;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'processing' | 'successful';
  date: string;
  timestamp: string;
  reference: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  description?: string;
  tax_amount?: number;
  processing_fee?: number;
  total_amount?: number;
  full_payment?: any;
  mpesa_receipt?: string;
  mpesa_number?: string;
  invoice_number?: string;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'history' | 'new'>('history');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [amount, setAmount] = useState('');
  const [serviceType, setServiceType] = useState('');

  const statusConfig = {
    completed: {
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      icon: FiCheckCircle,
      label: 'Completed',
    },
    successful: {
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      icon: FiCheckCircle,
      label: 'Successful',
    },
    pending: {
      color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      icon: FiClock,
      label: 'Pending',
    },
    failed: {
      color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      icon: FiXCircle,
      label: 'Failed',
    },
    processing: {
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      icon: FiLoader,
      label: 'Processing',
    },
  };

  // Fetch payments from backend
  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching payments...');

      const response = await api.get('/payments');
      console.log('Payments API response:', response);

      // Handle different response formats
      let paymentsData: Payment[] = [];

      if (response.payments) {
        paymentsData = response.payments;
      } else if (Array.isArray(response)) {
        paymentsData = response;
      } else if (response && typeof response === 'object') {
        paymentsData = response.data || [];
      }

      console.log(`Found ${paymentsData.length} payments`);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payment history');

      // Fallback to mock data for testing with timestamps
      const now = new Date();
      const currentDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const currentDateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      setPayments([
        {
          id: '1',
          amount: 15000,
          service: 'Data Analysis',
          service_type: 'data_service',
          method: 'M-Pesa',
          status: 'completed',
          date: currentDate,
          timestamp: currentTime,
          reference: 'TX-20240001',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          user_id: user?.id || 'user-123',
          description: 'Data analysis service payment',
          tax_amount: 0,
          processing_fee: 0,
          total_amount: 15000,
          mpesa_receipt: 'MP12345678',
          mpesa_number: '254712345678',
          invoice_number: 'INV-2024-001',
          date_full: '',
          datetime: ''
        },
        {
          id: '2',
          amount: 8000,
          service: 'Business Registration',
          service_type: 'business_registration',
          method: 'Card',
          status: 'completed',
          date: currentDate,
          timestamp: currentTime,
          datetime: currentDateTime,
          date_full: now.toISOString(),
          reference: 'TX-20240002',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          user_id: '1',
          description: 'Company registration fee',
          tax_amount: 0,
          processing_fee: 0,
          total_amount: 8000,
          invoice_number: 'INV-2024-002',
        },
        {
          id: '3',
          amount: 3000,
          service: 'KRA PIN Registration',
          service_type: 'kra_service',
          method: 'Bank Transfer',
          status: 'pending',
          date: currentDate,
          timestamp: currentTime,
          datetime: currentDateTime,
          date_full: now.toISOString(),
          reference: 'TX-20240003',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          user_id: '1',
          description: 'KRA PIN registration service',
          tax_amount: 0,
          processing_fee: 0,
          total_amount: 3000,
          invoice_number: 'INV-2024-003',
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayments();
    toast.success('Payments refreshed');
  };

  const handleMakePayment = () => {
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    toast.success('Payment initiated successfully!');
    setShowPaymentModal(false);
    // Refresh payments list
    await fetchPayments();
    // Reset form
    setSelectedService('');
    setAmount('');
    setServiceType('');
  };

  const formatTransactionTime = (dateString: string) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  };

  const generateReceiptPDF = (payment: Payment) => {
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text('Data Business Solutions Ltd', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('OFFICIAL PAYMENT RECEIPT', 105, 30, { align: 'center' });

    // Receipt Details with exact timestamp
    doc.setFontSize(10);
    doc.text(`Receipt No: ${payment.reference || payment.invoice_number || 'N/A'}`, 20, 50);
    doc.text(`Transaction Date: ${payment.date || new Date().toLocaleDateString()}`, 20, 57);

    // Include exact transaction time
    const transactionTime =
      payment.timestamp || formatTransactionTime(payment.date_full || payment.created_at);
    doc.text(`Transaction Time: ${transactionTime}`, 20, 64);

    // Customer Information
    doc.setFontSize(12);
    doc.text('Customer Information', 20, 90);
    doc.setFontSize(10);

    // Get user name properly
    let userName = 'Customer';
    if (user) {
      if (user.name) {
        userName = user.name;
      } else if (user.firstName && user.lastName) {
        userName = `${user.firstName} ${user.lastName}`;
      } else if (user.firstName) {
        userName = user.firstName;
      } else if (user.email) {
        userName = user.email.split('@')[0];
      }
    }

    doc.text(`Name: ${user?.name || user?.firstName + ' ' + user?.lastName || 'Customer'}`, 20, 97);
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, 104);

    // Show User ID from payment if available, otherwise from user context
    const userId = payment.user_id || user?.id || user?.userId || 'N/A';
    doc.text(`User ID: ${payment.user_id || 'N/A'}`, 20, 111);

    // Payment Details Table
    autoTable(doc, {
      startY: 115, // Changed from 125 to account for extra line
      head: [['Description', 'Amount (KES)']],
      body: [
        ['Service Payment', payment.amount.toLocaleString()],
        ['Processing Fee', '0.00'],
        ['VAT (0%)', '0.00'],
        ['Total Amount', payment.amount.toLocaleString()],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
    });

    // Payment Method Details
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.text('Payment Method Details', 20, finalY);
    doc.setFontSize(10);
    doc.text(`Method: ${payment.method}`, 20, finalY + 7);

    if (payment.mpesa_receipt) {
      doc.text(`M-Pesa Receipt: ${payment.mpesa_receipt}`, 20, finalY + 14);
    }
    if (payment.mpesa_number) {
      doc.text(`Phone: ${payment.mpesa_number}`, 20, finalY + 21);
    }

    // Transaction Verification
    const verificationY = finalY + 35;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('Transaction Verification', 20, verificationY);
    doc.setFontSize(9);
    doc.text(`Transaction ID: ${payment.id}`, 20, verificationY + 7);
    doc.text(`Reference: ${payment.reference}`, 20, verificationY + 14);
    if (payment.invoice_number) {
      doc.text(`Invoice: ${payment.invoice_number}`, 20, verificationY + 21);
    }

    // Terms and Footer
    const footerY = verificationY + 35;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'This receipt serves as proof of payment. Please retain for your records.',
      105,
      footerY,
      { align: 'center' }
    );
    doc.text('Thank you for your business!', 105, footerY + 7, { align: 'center' });
    doc.text(
      'For inquiries contact: info@databusiness.co.ke | +254 700 000 000',
      105,
      footerY + 14,
      { align: 'center' }
    );
    doc.text('Data Business Solutions Ltd | Nairobi, Kenya', 105, footerY + 21, {
      align: 'center',
    });

    // Save PDF
    const fileName = `receipt-${payment.reference || payment.id}.pdf`;
    doc.save(fileName);
  };;;

  const generateInvoicePDF = (payment: Payment) => {
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text('Data Business Solutions Ltd', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('TAX INVOICE', 105, 30, { align: 'center' });

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice No: ${payment.invoice_number || payment.reference || 'N/A'}`, 20, 50);
    doc.text(`Invoice Date: ${payment.date || new Date().toLocaleDateString()}`, 20, 57);

    // Include exact transaction time
    const transactionTime = payment.timestamp || formatTransactionTime(payment.created_at);
    doc.text(`Transaction Time: ${transactionTime}`, 20, 64);
    doc.text(`Due Date: ${new Date().toLocaleDateString()}`, 20, 71);

    // Bill To
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 88); // Adjusted Y position
    doc.setFontSize(10);

    // Get user name properly
    let userName = 'Customer';
    if (user) {
      if (user.name) {
        userName = user.name;
      } else if (user.firstName && user.lastName) {
        userName = `${user.firstName} ${user.lastName}`;
      } else if (user.firstName) {
        userName = user.firstName;
      } else if (user.email) {
        userName = user.email.split('@')[0];
      }
    }

    doc.text(`${userName}`, 20, 95);
    doc.text(`${user?.email || 'N/A'}`, 20, 102);

    // Invoice Items Table (adjust startY)
    autoTable(doc, {
      startY: 123,  
      head: [['Description', 'Quantity', 'Unit Price (KES)', 'Total (KES)']],
      body: [
        [
          payment.service || 'Service Payment',
          '1',
          payment.amount.toLocaleString(),
          payment.amount.toLocaleString(),
        ],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    autoTable(doc, {
      startY: finalY,
      body: [
        ['Subtotal', '', '', payment.amount.toLocaleString()],
        ['Processing Fee', '', '', '0.00'],
        ['VAT (0%)', '', '', '0.00'],
        ['Total Amount', '', '', payment.amount.toLocaleString()],
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        3: { fontStyle: 'bold' },
      },
    });

    // Payment Status and Details
    const statusY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('Payment Details', 20, statusY);
    doc.setFontSize(10);
    doc.text(`Payment Status: ${payment.status.toUpperCase()}`, 20, statusY + 7);
    doc.text(`Payment Method: ${payment.method}`, 20, statusY + 14);

    if (payment.mpesa_receipt) {
      doc.text(`M-Pesa Receipt: ${payment.mpesa_receipt}`, 20, statusY + 21);
    }

    // Transaction Information
    const transactionY = statusY + 28;
    doc.setFontSize(11);
    doc.text('Transaction Information', 20, transactionY);
    doc.setFontSize(9);
    doc.text(`Transaction ID: ${payment.id}`, 20, transactionY + 7);
    doc.text(`Reference: ${payment.reference}`, 20, transactionY + 14);

    // Footer
    const footerY = transactionY + 30;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Terms: Payment due upon receipt. Late payments subject to 5% monthly interest.',
      105,
      footerY,
      { align: 'center' }
    );
    doc.text('Thank you for your business!', 105, footerY + 7, { align: 'center' });
    doc.text('Data Business Solutions Ltd | Nairobi, Kenya', 105, footerY + 14, {
      align: 'center',
    });
    doc.text(`Invoice generated on: ${new Date().toLocaleString()}`, 105, footerY + 21, {
      align: 'center',
    });

    // Save PDF
    const fileName = `invoice-${payment.invoice_number || payment.reference || payment.id}.pdf`;
    doc.save(fileName);
  };;;;;;

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      // Find the payment in the list
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        toast.error('Payment not found');
        return;
      }

      // Generate and download PDF receipt
      generateReceiptPDF(payment);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      // Find the payment in the list
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        toast.error('Payment not found');
        return;
      }

      // Generate and download PDF invoice
      generateInvoicePDF(payment);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const handleViewDetails = async (paymentId: string) => {
    try {
      // Try to get payment details from existing data first
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        setSelectedPaymentDetails(payment);
        setShowPaymentDetails(true);
      } else {
        // If not found, fetch from API
        const response = await api.get(`/payments/${paymentId}`);
        if (response.success && response.payment) {
          setSelectedPaymentDetails(response.payment);
          setShowPaymentDetails(true);
        } else {
          toast.error('Could not load payment details');
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      toast.error('Failed to load payment details');
    }
  };

  const calculateTotals = () => {
    const amountNum = parseFloat(amount) || 0;
    const processingFee = 0; // No processing fee
    const taxAmount = 0; // No VAT
    const total = amountNum + processingFee + taxAmount;

    return {
      amount: amountNum,
      processingFee,
      taxAmount,
      total,
    };
  };

  const totals = calculateTotals();

  if (isLoading && payments.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View payment history and make new payments
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setActiveTab('new');
              setSelectedService('');
              setAmount('');
              setServiceType('');
            }}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <FiDollarSign />
            <span>Make Payment</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'new'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            New Payment
          </button>
        </nav>
      </div>

      {activeTab === 'history' ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {payments.length} payment{payments.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <FiDollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No payments found
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You haven't made any payments yet.
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  Make your first payment
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map(payment => {
                    const statusConfigKey =
                      payment.status === 'completed' ? 'successful' : payment.status;
                    const StatusIcon = statusConfig[statusConfigKey]?.icon || FiClock;
                    const statusClass = statusConfig[statusConfigKey] || statusConfig.pending;

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.service}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {payment.reference}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            KES {payment.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Total: KES {payment.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                payment.method === 'M-Pesa' || payment.method === 'mpesa'
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : payment.method === 'Card' || payment.method === 'card'
                                    ? 'bg-blue-100 dark:bg-blue-900'
                                    : 'bg-purple-100 dark:bg-purple-900'
                              }`}
                            >
                              <FiDollarSign
                                className={
                                  payment.method === 'M-Pesa' || payment.method === 'mpesa'
                                    ? 'text-green-600 dark:text-green-400'
                                    : payment.method === 'Card' || payment.method === 'card'
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-purple-600 dark:text-purple-400'
                                }
                              />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {payment.method === 'bank_transfer'
                                ? 'Bank Transfer'
                                : payment.method}
                            </span>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex flex-col">
                            <div className="flex items-center text-gray-900 dark:text-white">
                              <FiCalendar className="mr-1" size={12} />
                              <span>{payment.date}</span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                              <FiTime className="mr-1" size={12} />
                              <span>
                                {payment.timestamp ||
                                  formatTransactionTime(payment.date_full || payment.created_at)}
                              </span>
                            </div>
                          
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleDownloadReceipt(payment.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Download Receipt"
                            >
                              <FiDownload size={18} />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(payment.id)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Download Invoice"
                            >
                              <FiFileText size={18} />
                            </button>
                            <button
                              onClick={() => handleViewDetails(payment.id)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                              title="View Details"
                            >
                              <FiEye size={18} className="mr-1" />
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* New Payment Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                New Payment
              </h3>

              <div className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Service
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'data_service',
                        name: 'Data Services',
                        amount: 5000,
                        backendType: 'data_service',
                      },
                      {
                        id: 'business_registration',
                        name: 'Business Registration',
                        amount: 8000,
                        backendType: 'business_registration',
                      },
                      {
                        id: 'kra_service',
                        name: 'KRA Services',
                        amount: 3000,
                        backendType: 'kra_service',
                      },
                      {
                        id: 'bookkeeping',
                        name: 'Bookkeeping',
                        amount: 4000,
                        backendType: 'bookkeeping',
                      },
                    ].map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setSelectedService(service.id);
                          setServiceType(service.backendType); // Use backend-compatible value
                          setAmount(service.amount.toString());
                        }}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          selectedService === service.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          KES {service.amount.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Payment description..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleMakePayment}
                    disabled={!selectedService || !amount || parseFloat(amount) <= 0}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Payment Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    KES {totals.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                  <span className="font-medium">KES {totals.processingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="text-gray-600 dark:text-gray-400">VAT (0%):</span>
                  <span className="font-medium">KES {totals.taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total Amount:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      KES {totals.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Security</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• SSL encrypted payment</li>
                  <li>• PCI DSS compliant</li>
                  <li>• 3D Secure authentication</li>
                  <li>• Money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPaymentDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowPaymentDetails(false)}
            />

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Details
                  </h3>
                  <button
                    onClick={() => setShowPaymentDetails(false)}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Service</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedPaymentDetails.service}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        KES {selectedPaymentDetails.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedPaymentDetails.method}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedPaymentDetails.status === 'completed' ||
                          selectedPaymentDetails.status === 'successful'
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                            : selectedPaymentDetails.status === 'pending'
                              ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                              : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        {selectedPaymentDetails.status === 'completed'
                          ? 'Completed'
                          : selectedPaymentDetails.status === 'successful'
                            ? 'Successful'
                            : selectedPaymentDetails.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Date</p>
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <FiCalendar className="mr-1" size={14} />
                        <span>{selectedPaymentDetails.date}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Time</p>
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <FiTime className="mr-1" size={14} />
                        <span>
                          {selectedPaymentDetails.timestamp ||
                            formatTransactionTime(
                              selectedPaymentDetails.date_full || selectedPaymentDetails.created_at
                            )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Transaction Reference
                    </p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {selectedPaymentDetails.reference}
                    </p>
                  </div>

                  {selectedPaymentDetails.description && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedPaymentDetails.description}
                      </p>
                    </div>
                  )}

                  {/* Additional Details */}
                  {selectedPaymentDetails.mpesa_receipt && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">M-Pesa Receipt</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white">
                        {selectedPaymentDetails.mpesa_receipt}
                      </p>
                    </div>
                  )}

                  {selectedPaymentDetails.mpesa_number && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">M-Pesa Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedPaymentDetails.mpesa_number}
                      </p>
                    </div>
                  )}

                  {selectedPaymentDetails.invoice_number && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Invoice Number</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white">
                        {selectedPaymentDetails.invoice_number}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Payment Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Service Amount</span>
                        <span className="text-gray-900 dark:text-white">
                          KES {selectedPaymentDetails.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                        <span>KES 0.00</span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="text-gray-600 dark:text-gray-400">VAT (0%)</span>
                        <span>KES 0.00</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white">Total Amount</span>
                        <span className="text-primary-600 dark:text-primary-400">
                          KES {selectedPaymentDetails.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => {
                      handleDownloadReceipt(selectedPaymentDetails.id);
                      setShowPaymentDetails(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <FiDownload className="mr-2" />
                    Download Receipt
                  </button>
                  <button
                    onClick={() => setShowPaymentDetails(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={totals.amount}
        serviceType={serviceType}
        serviceId={selectedService}
      />
    </div>
  );
}
