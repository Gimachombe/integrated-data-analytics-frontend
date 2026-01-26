'use client';

import { useState } from 'react';
import { FiFileText, FiTrendingUp, FiDollarSign, FiCalendar, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const services = [
  {
    id: 'bookkeeping',
    label: 'Monthly Bookkeeping',
    description: 'Professional bookkeeping services',
    price: 5000,
  },
  {
    id: 'annual_reports',
    label: 'Annual Financial Reports',
    description: 'Comprehensive annual reports',
    price: 15000,
  },
  {
    id: 'tax_prep',
    label: 'Tax Preparation',
    description: 'Tax computation and filing',
    price: 8000,
  },
  {
    id: 'audit_prep',
    label: 'Audit Preparation',
    description: 'Prepare for financial audits',
    price: 20000,
  },
];

export default function BookkeepingPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'documents' | 'reports'>('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    financialPeriod: '',
    businessSize: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.success('Bookkeeping service request submitted successfully');
      setFormData({
        serviceType: '',
        financialPeriod: '',
        businessSize: '',
        requirements: '',
      });
      setSelectedService(null);
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bookkeeping & Audit Services
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Professional financial record keeping, reporting, and audit preparation services
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Upload Documents
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Financial Reports
          </button>
        </nav>
      </div>

      {activeTab === 'services' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`bg-white dark:bg-gray-800 border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-primary-500 ring-2 ring-primary-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  onClick={() => {
                    setSelectedService(service.id);
                    setFormData(prev => ({ ...prev, serviceType: service.id }));
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 mr-3">
                          <FiTrendingUp className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {service.label}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      KES {service.price.toLocaleString()}/month
                    </span>
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700">
                      Select Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {selectedService ? 'Service Request' : 'Select a Service'}
              </h3>

              {selectedService ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Financial Period
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., January 2024"
                      value={formData.financialPeriod}
                      onChange={e => setFormData({ ...formData, financialPeriod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Size
                    </label>
                    <select
                      value={formData.businessSize}
                      onChange={e => setFormData({ ...formData, businessSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select business size</option>
                      <option value="small">Small (Under 10 employees)</option>
                      <option value="medium">Medium (10-50 employees)</option>
                      <option value="large">Large (50+ employees)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Special Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                      rows={4}
                      placeholder="Any specific requirements or notes..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Request Service
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <FiFileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Select a bookkeeping service to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'documents' ? (
        /* Upload Documents */
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Upload Financial Documents
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bank Statements */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FiDollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h4 className="font-medium text-gray-900 dark:text-white mt-4">Bank Statements</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Upload your bank statements for the period
                </p>
                <button className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">
                  Upload Files
                </button>
              </div>

              {/* Invoices & Receipts */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h4 className="font-medium text-gray-900 dark:text-white mt-4">
                  Invoices & Receipts
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Upload sales and purchase invoices
                </p>
                <button className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">
                  Upload Files
                </button>
              </div>

              {/* Payroll Records */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FiCalendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h4 className="font-medium text-gray-900 dark:text-white mt-4">Payroll Records</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Upload payroll records and tax deductions
                </p>
                <button className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">
                  Upload Files
                </button>
              </div>
            </div>

            {/* Bulk Upload */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <FiUpload className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
              <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Bulk Upload</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Drag and drop multiple files or{' '}
                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  browse
                </button>{' '}
                to upload
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supported formats: PDF, Excel, CSV, JPG, PNG (up to 50MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Financial Reports */
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Financial Reports
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Generated On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiFileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Income Statement
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Profit & Loss Report
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      Q4 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      2024-01-15
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Ready
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Balance Sheet
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Assets & Liabilities
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      Q4 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      2024-01-15
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Ready
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiTrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Cash Flow Statement
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Cash inflow/outflow
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      Q4 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      2024-01-14
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Ready
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
