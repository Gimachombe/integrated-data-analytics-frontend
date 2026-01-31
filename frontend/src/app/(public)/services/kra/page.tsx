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
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const serviceCategories = [
  {
    id: 'registration',
    name: 'Tax Registration & Compliance',
    icon: '📝',
    services: [
      {
        id: 'pin_individual',
        label: 'KRA PIN Registration (Individual)',
        description: 'Register for a new individual KRA PIN',
        price: 1500,
        category: 'registration',
        estimatedTime: '1-2 business days',
        popular: true,
      },
      {
        id: 'pin_company',
        label: 'KRA PIN Registration (Company)',
        description: 'Register for a new company KRA PIN',
        price: 3000,
        category: 'registration',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'vat_registration',
        label: 'VAT Registration/Deregistration',
        description: 'Register or deregister for VAT',
        price: 5000,
        category: 'registration',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'paye_registration',
        label: 'PAYE Registration',
        description: 'Register for PAYE with KRA',
        price: 3000,
        category: 'registration',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'tax_obligation',
        label: 'Tax Obligation Activation/Deactivation',
        description: 'Activate or deactivate tax obligations',
        price: 2500,
        category: 'registration',
        estimatedTime: '1-2 business days',
      },
    ],
  },
  {
    id: 'filing',
    name: 'Filing of Tax Returns',
    icon: '📋',
    services: [
      {
        id: 'individual_income',
        label: 'Individual Income Tax Returns',
        description: 'File individual income tax returns',
        price: 2000,
        category: 'filing',
        estimatedTime: '24 hours',
        popular: true,
      },
      {
        id: 'nil_returns',
        label: 'Nil Returns (Company/Individual)',
        description: 'File nil tax returns',
        price: 500,
        category: 'filing',
        estimatedTime: '24 hours',
      },
      {
        id: 'company_income',
        label: 'Company Income Tax Returns',
        description: 'File company income tax returns (from KES 10,000)',
        price: 10000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 10000,
        estimatedTime: '2-3 business days',
        popular: true,
      },
      {
        id: 'paye_returns',
        label: 'PAYE Returns Monthly',
        description: 'Monthly PAYE filing (from KES 3,000)',
        price: 3000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 3000,
        estimatedTime: '24 hours',
      },
      {
        id: 'vat_returns',
        label: 'VAT Returns Monthly',
        description: 'Monthly VAT filing (from KES 4,000)',
        price: 4000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 4000,
        estimatedTime: '24 hours',
      },
      {
        id: 'withholding_tax',
        label: 'Withholding Tax Returns',
        description: 'File withholding tax returns (from KES 3,000)',
        price: 3000,
        category: 'filing',
        hasVariablePrice: true,
        minPrice: 3000,
        estimatedTime: '24 hours',
      },
      {
        id: 'turnover_tax',
        label: 'Turnover Tax (TOT) Returns',
        description: 'File Turnover Tax returns',
        price: 2500,
        category: 'filing',
        estimatedTime: '24 hours',
      },
      {
        id: 'rental_income',
        label: 'Rental Income Tax Returns',
        description: 'File rental income tax returns (from KES 3,000)',
        price: 3000,
        category: 'filing', // Fixed: was 'categories' (plural)
        hasVariablePrice: true,
        minPrice: 3000,
        estimatedTime: '2-3 business days',
      },
    ],
  },
  {
    id: 'advisory',
    name: 'Tax Advisory & Consultation',
    icon: '💼',
    services: [
      {
        id: 'tax_consultation',
        label: 'Tax Consultation (Hourly)',
        description: 'One-on-one tax advisory session',
        price: 3000,
        category: 'advisory',
        estimatedTime: '1 hour',
        hasVariablePrice: true,
        minPrice: 3000,
      },
      {
        id: 'tax_planning',
        label: 'Tax Planning Service',
        description: 'Strategic tax planning and optimization',
        price: 15000,
        category: 'advisory',
        estimatedTime: '1-2 weeks',
        popular: true,
      },
      {
        id: 'compliance_review',
        label: 'Tax Compliance Review',
        description: 'Comprehensive tax compliance assessment',
        price: 10000,
        category: 'advisory',
        estimatedTime: '3-5 business days',
      },
    ],
  },
  {
    id: 'certificates',
    name: 'Certificates & Clearances',
    icon: '🏛️',
    services: [
      {
        id: 'tax_clearance',
        label: 'Tax Clearance Certificate',
        description: 'Apply for tax clearance certificate',
        price: 3500,
        category: 'certificates',
        estimatedTime: '3-5 business days',
        popular: true,
      },
      {
        id: 'compliance_cert',
        label: 'Tax Compliance Certificate',
        description: 'Obtain tax compliance certificate',
        price: 4000,
        category: 'certificates',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'pin_certificate',
        label: 'PIN Certificate Reprint',
        description: 'Reprint lost PIN certificate',
        price: 1000,
        category: 'certificates',
        estimatedTime: '24 hours',
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
}

export default function KRAServicesPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [activeCategory, setActiveCategory] = useState('registration');

  // Load selected services from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('selectedKRAServices');
    if (savedServices) {
      setSelectedServices(JSON.parse(savedServices));
    }
  }, []);

  // Save selected services to localStorage
  useEffect(() => {
    localStorage.setItem('selectedKRAServices', JSON.stringify(selectedServices));
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
    localStorage.removeItem('selectedKRAServices');
  };

  const handleAddToServiceRequest = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    // Format services for the service request
    const formattedServices = selectedServices.map(service => ({
      type: 'kra',
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
      },
    }));

    // Save services to localStorage for the service request form
    localStorage.setItem(
      'pendingServiceRequest',
      JSON.stringify({
        serviceType: 'kra',
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <button
              onClick={handleBackToServices}
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Services Page
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">KRA Tax Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Complete tax compliance solutions including registration, filing, and advisory
              services. Select multiple services and add them to your service request.
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
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
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
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Rates are subject to complexity and volume of
                    transactions. Statutory penalties, interests and KRA charges (if any) are billed
                    separately.
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
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-transparent hover:border-blue-200 hover:shadow-lg'
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
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? <FiCheckCircle size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                        {/* Service Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-2" size={16} />
                            <span>{service.estimatedTime}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiFileText className="mr-2" size={16} />
                            <span className="capitalize">
                              {service.category?.replace('_', ' ') || 'Uncategorized'}
                            </span>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              KES {service.price.toLocaleString()}
                            </div>
                            {service.hasVariablePrice && (
                              <div className="text-xs text-gray-500">Starting from</div>
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
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onClick={e => e.stopPropagation()}
                              />
                              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                                each
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum: KES {service.minPrice?.toLocaleString()}
                            </p>
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
                            <span className="font-semibold text-blue-600">
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
                      className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                    >
                      <span>Add to Service Request</span>
                      <FiArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        onClick={handleBackToServices}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
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
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-semibold flex items-center"
            >
              <FiShoppingCart className="mr-2" size={20} />
              <span>Add {selectedServices.length} Services</span>
              <span className="ml-3 bg-white text-blue-600 px-2 py-1 rounded-full text-sm">
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
            How to Request KRA Services
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Services</h3>
              <p className="text-gray-600">Select from our KRA service categories</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add to Cart</h3>
              <p className="text-gray-600">Click "Add Service" for each service you need</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Request</h3>
              <p className="text-gray-600">Click "Add to Service Request"</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Details</h3>
              <p className="text-gray-600">Fill your details in the request form</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
