'use client';

import { useState } from 'react';
import { FiCalendar, FiFileText, FiCheckCircle, FiAlertCircle, FiDollarSign } from 'react-icons/fi';

const maintenanceServices = [
  {
    id: 'annual_returns',
    title: 'Annual Returns Filing',
    description: 'File your company annual returns with the registrar',
    price: 3000,
    features: [
      'Annual Return Preparation',
      'Director Updates',
      'Shareholder Updates',
      'Compliance Check',
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance Tracking',
    description: 'Track and manage all compliance requirements',
    price: 2000,
    features: [
      'Compliance Calendar',
      'Deadline Alerts',
      'Document Management',
      'Regulatory Updates',
    ],
  },
  {
    id: 'updates',
    title: 'Company Updates',
    description: 'Update company details and records',
    price: 1500,
    features: ['Director Changes', 'Address Updates', 'Business Name Changes', 'Record Updates'],
  },
  {
    id: 'full_service',
    title: 'Full Maintenance Package',
    description: 'Complete company maintenance solution',
    price: 6000,
    features: ['Annual Returns', 'Compliance Tracking', 'Company Updates', 'Priority Support'],
  },
];

export default function CompanyMaintenancePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyNumber: '',
    year: new Date().getFullYear().toString(),
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Maintenance service request submitted successfully!');
    setFormData({
      companyName: '',
      companyNumber: '',
      year: new Date().getFullYear().toString(),
      details: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Maintenance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Keep your company compliant and up-to-date with our maintenance services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maintenanceServices.map(service => (
              <div
                key={service.id}
                className={`bg-white dark:bg-gray-800 border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedService === service.id
                    ? 'border-primary-500 ring-2 ring-primary-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">
                    <FiCalendar className="text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Includes:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                      >
                        <FiCheckCircle className="mr-2 text-green-500" size={12} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    KES {service.price.toLocaleString()}
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
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Registration Number *
                  </label>
                  <input
                    type="text"
                    value={formData.companyNumber}
                    onChange={e => setFormData({ ...formData, companyNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Financial Year *
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
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
                    Submit Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Select a maintenance service to get started
                </p>
              </div>
            )}

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start">
                <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 mt-1 space-y-1">
                    <li>• Annual returns are due within 42 days of AGM</li>
                    <li>• Late filing attracts penalties</li>
                    <li>• Keep company details updated always</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
