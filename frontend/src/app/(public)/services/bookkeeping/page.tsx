'use client';

import { useState, useEffect } from 'react';
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
  FiDollarSign,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const serviceCategories = [
  {
    id: 'basic',
    name: 'Basic Bookkeeping',
    icon: '📊',
    services: [
      {
        id: 'transaction_recording',
        label: 'Transaction Recording & Categorization',
        description: 'Daily/monthly recording and categorization of financial transactions',
        price: 15000,
        category: 'basic',
        estimatedTime: 'Monthly',
        popular: true,
        frequency: ['monthly', 'quarterly', 'annual'],
      },
      {
        id: 'bank_reconciliation',
        label: 'Bank Reconciliation',
        description: 'Monthly reconciliation of bank statements with book records',
        price: 8000,
        category: 'basic',
        estimatedTime: 'Monthly',
        frequency: ['monthly'],
      },
      {
        id: 'accounts_receivable',
        label: 'Accounts Receivable Management',
        description: 'Invoice preparation, tracking, and debtors management',
        price: 12000,
        category: 'basic',
        estimatedTime: 'Monthly',
        popular: true,
        frequency: ['monthly'],
      },
      {
        id: 'accounts_payable',
        label: 'Accounts Payable Management',
        description: 'Bills tracking, payments scheduling, and creditors management',
        price: 10000,
        category: 'basic',
        estimatedTime: 'Monthly',
        frequency: ['monthly'],
      },
      {
        id: 'payroll_processing',
        label: 'Payroll Processing',
        description: 'Salary calculations, PAYE deductions, and payroll reports',
        price: 18000,
        category: 'basic',
        estimatedTime: 'Monthly',
        hasVariablePrice: true,
        minPrice: 18000,
        frequency: ['monthly'],
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Reporting',
    icon: '📈',
    services: [
      {
        id: 'profit_loss',
        label: 'Profit & Loss Statements',
        description: 'Monthly/quarterly profit and loss statements preparation',
        price: 15000,
        category: 'financial',
        estimatedTime: 'Monthly/Quarterly',
        popular: true,
        frequency: ['monthly', 'quarterly'],
      },
      {
        id: 'balance_sheets',
        label: 'Balance Sheet Preparation',
        description: 'Financial position statements with assets, liabilities, and equity',
        price: 20000,
        category: 'financial',
        estimatedTime: 'Monthly/Quarterly',
        frequency: ['monthly', 'quarterly'],
      },
      {
        id: 'cashflow_statements',
        label: 'Cash Flow Statements',
        description: 'Operating, investing, and financing cash flow analysis',
        price: 18000,
        category: 'financial',
        estimatedTime: 'Monthly/Quarterly',
        frequency: ['monthly', 'quarterly'],
      },
      {
        id: 'management_reports',
        label: 'Management Reports',
        description: 'Custom management reports with KPIs and financial insights',
        price: 25000,
        category: 'financial',
        estimatedTime: 'Monthly',
        hasVariablePrice: true,
        minPrice: 25000,
        frequency: ['monthly'],
      },
      {
        id: 'budget_variance',
        label: 'Budget vs Actual Analysis',
        description: 'Comparison of actual performance against budget',
        price: 15000,
        category: 'financial',
        estimatedTime: 'Monthly/Quarterly',
        frequency: ['monthly', 'quarterly'],
      },
    ],
  },
  {
    id: 'software',
    name: 'Accounting Software',
    icon: '💻',
    services: [
      {
        id: 'quickbooks_setup',
        label: 'QuickBooks Setup & Training',
        description: 'Complete QuickBooks setup and user training',
        price: 35000,
        category: 'software',
        estimatedTime: '2-3 weeks',
        popular: true,
      },
      {
        id: 'sage_setup',
        label: 'Sage Accounting Setup',
        description: 'Sage accounting software implementation and configuration',
        price: 40000,
        category: 'software',
        estimatedTime: '2-3 weeks',
      },
      {
        id: 'xero_setup',
        label: 'Xero Setup & Migration',
        description: 'Xero accounting setup and data migration services',
        price: 30000,
        category: 'software',
        estimatedTime: '2-3 weeks',
      },
      {
        id: 'custom_chart',
        label: 'Custom Chart of Accounts',
        description: 'Design and implementation of customized chart of accounts',
        price: 20000,
        category: 'software',
        estimatedTime: '1-2 weeks',
      },
      {
        id: 'software_training',
        label: 'Accounting Software Training',
        description: 'Comprehensive training on accounting software usage',
        price: 15000,
        category: 'software',
        estimatedTime: 'Per session',
        hasVariablePrice: true,
        minPrice: 15000,
      },
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance & Audit',
    icon: '🏛️',
    services: [
      {
        id: 'monthly_compliance',
        label: 'Monthly Compliance Package',
        description: 'Monthly bookkeeping with compliance reporting',
        price: 30000,
        category: 'compliance',
        estimatedTime: 'Monthly',
        popular: true,
        frequency: ['monthly'],
      },
      {
        id: 'quarterly_reviews',
        label: 'Quarterly Financial Reviews',
        description: 'Comprehensive quarterly financial review and reporting',
        price: 45000,
        category: 'compliance',
        estimatedTime: 'Quarterly',
        frequency: ['quarterly'],
      },
      {
        id: 'annual_financials',
        label: 'Annual Financial Statements',
        description: 'Preparation of annual financial statements for audit',
        price: 60000,
        category: 'compliance',
        estimatedTime: 'Annually',
        hasVariablePrice: true,
        minPrice: 60000,
        frequency: ['annual'],
      },
      {
        id: 'audit_preparation',
        label: 'Audit Preparation & Support',
        description: 'Preparation of audit files and auditor liaison',
        price: 50000,
        category: 'compliance',
        estimatedTime: 'As needed',
        hasVariablePrice: true,
        minPrice: 50000,
      },
      {
        id: 'tax_preparation',
        label: 'Tax Preparation Support',
        description: 'Preparation of schedules and documentation for tax filing',
        price: 25000,
        category: 'compliance',
        estimatedTime: 'Monthly/Annually',
        frequency: ['monthly', 'annual'],
      },
    ],
  },
  {
    id: 'specialized',
    name: 'Specialized Services',
    icon: '🎯',
    services: [
      {
        id: 'inventory_accounting',
        label: 'Inventory Accounting',
        description: 'Inventory valuation, tracking, and accounting',
        price: 25000,
        category: 'specialized',
        estimatedTime: 'Monthly',
        hasVariablePrice: true,
        minPrice: 25000,
        frequency: ['monthly'],
      },
      {
        id: 'fixed_assets',
        label: 'Fixed Assets Register',
        description: 'Maintenance of fixed assets register and depreciation',
        price: 20000,
        category: 'specialized',
        estimatedTime: 'Quarterly/Annually',
        frequency: ['quarterly', 'annual'],
      },
      {
        id: 'cost_accounting',
        label: 'Cost Accounting',
        description: 'Cost analysis and product/service costing',
        price: 35000,
        category: 'specialized',
        estimatedTime: 'Monthly/Quarterly',
        hasVariablePrice: true,
        minPrice: 35000,
        frequency: ['monthly', 'quarterly'],
      },
      {
        id: 'project_accounting',
        label: 'Project Accounting',
        description: 'Financial tracking and reporting for projects',
        price: 30000,
        category: 'specialized',
        estimatedTime: 'Project basis',
        hasVariablePrice: true,
        minPrice: 30000,
      },
      {
        id: 'financial_analysis',
        label: 'Financial Analysis & Insights',
        description: 'Deep financial analysis and strategic insights',
        price: 40000,
        category: 'specialized',
        estimatedTime: 'Monthly/Quarterly',
        hasVariablePrice: true,
        minPrice: 40000,
        frequency: ['monthly', 'quarterly'],
      },
    ],
  },
  {
    id: 'packages',
    name: 'Service Packages',
    icon: '📦',
    services: [
      {
        id: 'starter_package',
        label: 'Starter Package (Small Business)',
        description: 'Basic bookkeeping, bank reconciliation, and monthly P&L',
        price: 35000,
        category: 'packages',
        estimatedTime: 'Monthly',
        popular: true,
        frequency: ['monthly'],
        includes: ['Transaction recording', 'Bank reconciliation', 'Monthly P&L', 'Basic reports'],
      },
      {
        id: 'growth_package',
        label: 'Growth Package (Medium Business)',
        description: 'Comprehensive bookkeeping with full financial reporting',
        price: 60000,
        category: 'packages',
        estimatedTime: 'Monthly',
        frequency: ['monthly'],
        includes: [
          'Full bookkeeping',
          'Financial statements',
          'Management reports',
          'Compliance support',
        ],
      },
      {
        id: 'premium_package',
        label: 'Premium Package (Large Business)',
        description: 'Full-service accounting with CFO-level insights',
        price: 100000,
        category: 'packages',
        estimatedTime: 'Monthly',
        frequency: ['monthly'],
        includes: ['Complete accounting', 'Strategic insights', 'Audit support', 'Tax planning'],
      },
      {
        id: 'custom_package',
        label: 'Custom Package',
        description: 'Tailored bookkeeping package based on your specific needs',
        price: 0,
        category: 'packages',
        estimatedTime: 'Custom',
        hasVariablePrice: true,
        minPrice: 20000,
        isCustom: true,
      },
    ],
  },
];

interface SelectedService {
  id: string;
  label: string;
  price: number;
  quantity: number;
  customPrice?: number;
  hasVariablePrice?: boolean;
  minPrice?: number;
  estimatedTime?: string;
  category: string;
  frequency?: string[];
  includes?: string[];
  isCustom?: boolean;
}

export default function BookkeepingServicesPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [activeCategory, setActiveCategory] = useState('basic');

  // Load selected services from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('selectedBookkeepingServices');
    if (savedServices) {
      setSelectedServices(JSON.parse(savedServices));
    }
  }, []);

  // Save selected services to localStorage
  useEffect(() => {
    localStorage.setItem('selectedBookkeepingServices', JSON.stringify(selectedServices));
  }, [selectedServices]);

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
            estimatedTime: service.estimatedTime,
            category: service.category,
            frequency: service.frequency,
            includes: service.includes,
            isCustom: service.isCustom,
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

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const clearAllServices = () => {
    setSelectedServices([]);
    localStorage.removeItem('selectedBookkeepingServices');
  };

  const handleAddToServiceRequest = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    // Format services for the service request
    const formattedServices = selectedServices.map(service => ({
      type: 'bookkeeping',
      serviceId: service.id,
      name: service.label,
      quantity: service.quantity,
      unitPrice: service.customPrice || service.price,
      totalPrice: (service.customPrice || service.price) * service.quantity,
      details: {
        hasVariablePrice: service.hasVariablePrice,
        minPrice: service.minPrice,
        estimatedTime: service.estimatedTime,
        category: service.category,
        frequency: service.frequency,
        includes: service.includes,
        isCustom: service.isCustom,
      },
    }));

    // Save services to localStorage for the service request form
    localStorage.setItem(
      'pendingServiceRequest',
      JSON.stringify({
        serviceType: 'bookkeeping',
        services: formattedServices,
        totalAmount: totalAmount,
        timestamp: new Date().toISOString(),
      })
    );

    // Redirect to service request form
    router.push('/services/request');
  };

  const handleServiceClick = (service: any) => {
    toggleServiceSelection(service);
  };

  const handleBackToServices = () => {
    router.push('/services');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <button
              onClick={handleBackToServices}
              className="inline-flex items-center text-green-100 hover:text-white mb-6"
            >
              <FiArrowLeft className="mr-2" />
              Back to Services Page
            </button>
            <div className="flex items-center justify-center mb-4">
              <FiDollarSign className="text-4xl mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Professional Bookkeeping Services</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Complete bookkeeping solutions for businesses of all sizes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
              <div className="space-y-2">
                {serviceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      activeCategory === category.id
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl mr-3">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {category.services.length} services
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content - Services */}
          <div className="lg:col-span-2">
            {/* Important Notice */}
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiClock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Most bookkeeping services are offered on a
                    monthly/quarterly/annual basis.
                  </p>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {serviceCategories
                .find(cat => cat.id === activeCategory)
                ?.services.map(service => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  const selectedService = selectedServices.find(s => s.id === service.id);

                  return (
                    <div
                      key={service.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-green-500 ring-2 ring-green-200'
                          : 'border-transparent hover:border-green-200 hover:shadow-lg'
                      }`}
                    >
                      <div className="p-6">
                        {/* Service Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{service.label}</h3>
                            {service.popular && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleServiceClick(service)}
                            className={`p-2 rounded-full ${
                              isSelected
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? <FiCheckCircle size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                        {/* Included Features (for packages) */}
                        {service.includes && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                            <ul className="space-y-1">
                              {service.includes.map((item, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-600">
                                  <FiCheckCircle className="mr-2 text-green-500" size={12} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Service Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-2" size={16} />
                            <span>{service.estimatedTime}</span>
                          </div>
                          {service.frequency && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FiFileText className="mr-2" size={16} />
                              <span>
                                {service.frequency.join(', ').replace(/, ([^,]*)$/, ' or $1')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            {service.price === 0 ? (
                              <>
                                <div className="text-2xl font-bold text-gray-900">Custom Quote</div>
                                <div className="text-xs text-gray-500">
                                  Starting from KES 20,000
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-2xl font-bold text-gray-900">
                                  KES {service.price.toLocaleString()}
                                </div>
                                {service.hasVariablePrice && (
                                  <div className="text-xs text-gray-500">Starting from</div>
                                )}
                              </>
                            )}
                          </div>

                          {isSelected && selectedService ? (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateServiceQuantity(service.id, selectedService.quantity - 1);
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded-l-lg"
                                >
                                  <FiMinus size={18} />
                                </button>
                                <span className="px-3 py-1 min-w-[2rem] text-center">
                                  {selectedService.quantity}
                                </span>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateServiceQuantity(service.id, selectedService.quantity + 1);
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded-r-lg"
                                >
                                  <FiPlus size={18} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleServiceClick(service)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Add Service
                            </button>
                          )}
                        </div>

                        {/* Custom Price Input (if selected and has variable price) */}
                        {isSelected && service.hasVariablePrice && selectedService && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Custom Price (KES)
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min={service.minPrice}
                                value={selectedService.customPrice || service.price}
                                onChange={e =>
                                  updateServicePrice(service.id, Number(e.target.value))
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onClick={e => e.stopPropagation()}
                              />
                              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                                each
                              </span>
                            </div>
                            {service.minPrice && (
                              <p className="text-xs text-gray-500 mt-1">
                                Minimum: KES {service.minPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right sidebar - Selected Services */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Selected Services</h3>
                {selectedServices.length > 0 && (
                  <button
                    onClick={clearAllServices}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedServices.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">No services selected yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Select services from the list to add them here
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {selectedServices.map(service => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {service.label}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <FiClock className="mr-1" size={12} />
                              {service.estimatedTime}
                            </div>
                          </div>
                          <button
                            onClick={() => removeService(service.id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            ×
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateServiceQuantity(service.id, service.quantity - 1)
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={service.quantity <= 1}
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="mx-2 min-w-[2rem] text-center">
                                {service.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateServiceQuantity(service.id, service.quantity + 1)
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                          </div>

                          {service.hasVariablePrice && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Unit Price (KES)
                              </label>
                              <input
                                type="number"
                                min={service.minPrice || 0}
                                value={service.customPrice || service.price}
                                onChange={e =>
                                  updateServicePrice(service.id, Number(e.target.value))
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-900">Item Total:</span>
                            <span className="font-semibold text-green-600">
                              KES{' '}
                              {(
                                (service.customPrice || service.price) * service.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Subtotal:</span>
                      <span className="text-lg font-bold text-gray-900">
                        KES {totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleAddToServiceRequest}
                      className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                    >
                      <span>Add to Service Request</span>
                      <FiArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        onClick={handleBackToServices}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline"
                      >
                        ← Back to All Services
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Cart Button (Mobile) */}
        {selectedServices.length > 0 && (
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={handleAddToServiceRequest}
              className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors font-semibold flex items-center"
            >
              <FiShoppingCart className="mr-2" size={20} />
              <span>Add {selectedServices.length} Services</span>
              <span className="ml-3 bg-white text-green-600 px-2 py-1 rounded-full text-sm">
                KES {totalAmount.toLocaleString()}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Bookkeeping Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-600">We assess your current financial processes and needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup</h3>
              <p className="text-gray-600">Set up appropriate systems and chart of accounts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing</h3>
              <p className="text-gray-600">Regular processing and reconciliation of transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reporting</h3>
              <p className="text-gray-600">
                Timely financial reports and insights for decision making
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
