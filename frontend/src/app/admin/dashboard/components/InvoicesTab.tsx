'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiDownload, FiMail, FiFileText } from 'react-icons/fi';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  paid_at?: string;
  pdf_url?: string;
}

export default function InvoicesTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data since we don't have invoices API yet
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoice_number: 'INV-2024-0001',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      total_amount: 27000,
      status: 'paid',
      issue_date: '2024-01-18',
      due_date: '2024-01-25',
      paid_at: '2024-01-18',
    },
    {
      id: '2',
      invoice_number: 'INV-2024-0002',
      customer_name: 'Michael Wang',
      customer_email: 'michael@example.com',
      total_amount: 35000,
      status: 'paid',
      issue_date: '2024-01-10',
      due_date: '2024-01-17',
      paid_at: '2024-01-10',
    },
    {
      id: '3',
      invoice_number: 'INV-2024-0003',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      total_amount: 8000,
      status: 'sent',
      issue_date: '2024-01-19',
      due_date: '2024-01-26',
    },
    {
      id: '4',
      invoice_number: 'INV-2024-0004',
      customer_name: 'Sarah Chege',
      customer_email: 'sarah@example.com',
      total_amount: 35000,
      status: 'draft',
      issue_date: '2024-01-22',
      due_date: '2024-01-29',
    },
    {
      id: '5',
      invoice_number: 'INV-2024-0005',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      total_amount: 15000,
      status: 'overdue',
      issue_date: '2024-01-05',
      due_date: '2024-01-12',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvoices(mockInvoices);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateInvoice = () => {
    toast.success('Create invoice functionality coming soon');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    toast.success(`Viewing invoice ${invoice.invoice_number}`);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading invoice ${invoice.invoice_number}`);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    toast.success(`Sending invoice ${invoice.invoice_number} to ${invoice.customer_email}`);
  };

  const filteredInvoices =
    statusFilter === 'all' ? invoices : invoices.filter(inv => inv.status === statusFilter);

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
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Invoices & Receipts</h3>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleCreateInvoice}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiPlus className="mr-2" />
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {invoice.invoice_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.customer_name}</div>
                    <div className="text-sm text-gray-500">{invoice.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      KES {invoice.total_amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : invoice.status === 'viewed'
                              ? 'bg-purple-100 text-purple-800'
                              : invoice.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : invoice.status === 'draft'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Invoice"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Download PDF"
                      >
                        <FiDownload size={18} />
                      </button>
                      <button
                        onClick={() => handleSendInvoice(invoice)}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Send via Email"
                      >
                        <FiMail size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FiFileText className="text-gray-400 mb-2" size={32} />
                    <p>No invoices found</p>
                    <p className="text-sm">Try adjusting your status filter</p>
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
