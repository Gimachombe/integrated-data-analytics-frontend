'use client';

import { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiCheckCircle, FiClock, FiPlus, FiMinus } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const serviceCategories = [
  {
    id: 'registration',
    name: 'Tax Registration & Compliance',
    services: [
      {
        id: 'pin_individual',
        label: 'KRA PIN Registration (Individual)',
        description: 'Register for a new individual KRA PIN',
        price: 1500,
        category: 'registration',
      },
      {
        id: 'pin_company',
        label: 'KRA PIN Registration (Company)',
        description: 'Register for a new company KRA PIN',
        price: 3000,
        category: 'registration',
      },
      {
        id: 'vat_registration',
        label: 'VAT Registration/Deregistration',
        description: 'Register or deregister for VAT',
        price: 5000,
        category: 'registration',
      },
      {
        id: 'paye_registration',
        label: 'PAYE Registration',
        description: 'Register for PAYE with KRA',
        price: 3000,
        category: 'registration',
      },
      {
        id: 'tax_obligation',
        label: 'Tax Obligation Activation/Deactivation',
        description: 'Activate or deactivate tax obligations',
        price: 2500,
        category: 'registration',
      },
    ],
  },
  {
    id: 'filing',
    name: 'Filing of Tax Returns',
    services: [
      {
        id: 'individual_income',
        label: 'Individual Income Tax Returns',
        description: 'File individual income tax returns',
        price: 2000,
        category: 'filing',
      },
      {
        id: 'nil_returns',
        label: 'Nil Returns (Company/Individual)',
        description: 'File nil tax returns',
        price: 500,
        category: 'filing',
      },
      {
        id: 'company_income',
        label: 'Company Income Tax Returns',
        description: 'File company income tax returns (from KES 10,000)',
        price: 10000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 10000,
      },
      {
        id: 'paye_returns',
        label: 'PAYE Returns Monthly',
        description: 'Monthly PAYE filing (from KES 3,000)',
        price: 3000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 3000,
      },
      {
        id: 'vat_returns',
        label: 'VAT Returns Monthly',
        description: 'Monthly VAT filing (from KES 4,000)',
        price: 4000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 4000,
      },
      {
        id: 'withholding_tax',
        label: 'Withholding Tax Returns',
        description: 'File withholding tax returns (from KES 3,000)',
        price: 3000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 3000,
      },
      {
        id: 'turnover_tax',
        label: 'Turnover Tax (TOT) Returns',
        description: 'File Turnover Tax returns',
        price: 2500,
        category: 'filing',
      },
      {
        id: 'rental_income',
        label: 'Rental Income Tax Returns',
        description: 'File rental income tax returns (from KES 3,000)',
        price: 3000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 3000,
      },
    ],
  },
];

const taxTypes = [
  { id: 'income', label: 'Income Tax' },
  { id: 'vat', label: 'VAT' },
  { id: 'paye', label: 'PAYE' },
  { id: 'withholding', label: 'Withholding Tax' },
  { id: 'turnover', label: 'Turnover Tax (TOT)' },
  { id: 'rental', label: 'Rental Income Tax' },
];

interface SelectedService {
  id: string;
  label: string;
  price: number;
  quantity: number;
  customPrice?: number;
  hasVariablePrice?: boolean;
  minPrice?: number;
}

export default function KRAServicesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'services' | 'history'>('services');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    serviceType: '',
    taxType: '',
    period: '',
    notes: '',
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      type: 'PIN Registration',
      status: 'completed',
      date: '2024-01-15',
      reference: 'KRA-001',
      amount: 1500,
    },
    {
      id: 2,
      type: 'Tax Filing',
      status: 'in_progress',
      date: '2024-01-10',
      reference: 'KRA-002',
      amount: 3000,
    },
    {
      id: 3,
      type: 'Compliance Certificate',
      status: 'pending',
      date: '2024-01-05',
      reference: 'KRA-003',
      amount: 2000,
    },
  ]);

  const [activeCategory, setActiveCategory] = useState('registration');

  // Calculate total amount
  const totalAmount = selectedServices.reduce((total, service) => {
    const price = service.customPrice || service.price;
    return total + price * service.quantity;
  }, 0);

  const toggleServiceSelection = (service: any) => {
    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === service.id);

      if (existingIndex >= 0) {
        // Remove service if already selected
        return prev.filter(s => s.id !== service.id);
      } else {
        // Add new service
        return [
          ...prev,
          {
            id: service.id,
            label: service.label,
            price: service.price,
            quantity: 1,
            hasVariablePrice: service.hasVariablePrice,
            minPrice: service.minPrice,
            ...(service.hasVariablePrice && { customPrice: service.minPrice || service.price }),
          },
        ];
      }
    });
  };

  const updateServiceQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setSelectedServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, quantity: newQuantity } : service
      )
    );
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setSelectedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, customPrice: Math.max(newPrice, service.minPrice || 0) }
          : service
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedServices.length === 0) {
        toast.error('Please select at least one service');
        return;
      }

      // Prepare service details for submission
      const serviceDetails = selectedServices.map(service => ({
        serviceId: service.id,
        serviceName: service.label,
        quantity: service.quantity,
        unitPrice: service.customPrice || service.price,
        totalPrice: (service.customPrice || service.price) * service.quantity,
      }));

      const submissionData = {
        ...formData,
        services: serviceDetails,
        totalAmount,
        userId: user?.id,
      };

      // TODO: Submit to your backend
      console.log('Submitting:', submissionData);

      toast.success('KRA service request submitted successfully!');

      // Reset form
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        serviceType: '',
        taxType: '',
        period: '',
        notes: '',
      });
      setSelectedServices([]);
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KRA Services</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Complete tax compliance solutions including PIN registration, filing, and advisory
          services
        </p>

        {/* Important Notes */}
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Important Notes:</strong> Rates are subject to complexity and volume of
            transactions. Statutory penalties, interests and KRA charges (if any) are billed
            separately.
          </p>
        </div>
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
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            My Requests
          </button>
        </nav>
      </div>

      {activeTab === 'services' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {serviceCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceCategories
                .find(cat => cat.id === activeCategory)
                ?.services.map(service => {
                  const isSelected = selectedServices.some(s => s.id === service.id);

                  return (
                    <div
                      key={service.id}
                      className={`bg-white dark:bg-gray-800 border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={() => toggleServiceSelection(service)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {service.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {service.description}
                          </p>
                        </div>
                        <div
                          className={`${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}
                        >
                          <FiFileText size={24} />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            KES {service.price.toLocaleString()}
                          </span>
                          {service.hasVariablePrice && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              (from)
                            </span>
                          )}
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            isSelected
                              ? 'bg-primary-600 hover:bg-primary-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Add Service'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Service Form & Cart */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Services Cart */}
            {selectedServices.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Selected Services ({selectedServices.length})
                </h3>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedServices.map(service => (
                    <div
                      key={service.id}
                      className="border-b border-gray-100 dark:border-gray-700 pb-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {service.label}
                        </h4>
                        <button
                          onClick={() => toggleServiceSelection(service)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      {service.hasVariablePrice ? (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Custom Price (KES)
                            </label>
                            <input
                              type="number"
                              min={service.minPrice}
                              value={service.customPrice || service.price}
                              onChange={e => updateServicePrice(service.id, Number(e.target.value))}
                              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Minimum: KES {service.minPrice?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 dark:text-primary-400 font-bold">
                            KES {(service.customPrice || service.price).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateServiceQuantity(service.id, service.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded">
                            {service.quantity}
                          </span>
                          <button
                            onClick={() => updateServiceQuantity(service.id, service.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          KES{' '}
                          {(
                            (service.customPrice || service.price) * service.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Amount */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium">KES {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total Amount:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      KES {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Service Request Form */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {selectedServices.length > 0 ? 'Complete Your Request' : 'Client Information'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Physical Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax Period (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., January 2024"
                    value={formData.period}
                    onChange={e => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Any special requirements or instructions..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={selectedServices.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      selectedServices.length === 0
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {selectedServices.length === 0
                      ? 'Select Services to Proceed'
                      : `Submit & Pay KES ${totalAmount.toLocaleString()}`}
                  </button>

                  {selectedServices.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      You'll be redirected to payment after submitting
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Requests History */
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              My KRA Service Requests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map(request => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {request.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : request.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {request.status === 'completed' ? (
                          <FiCheckCircle className="mr-1" size={12} />
                        ) : (
                          <FiClock className="mr-1" size={12} />
                        )}
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        KES {request.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                        <FiDownload size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-2">
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
