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
  FiBriefcase,
  FiGlobe,
  FiUsers,
  FiBook,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const serviceCategories = [
  {
    id: 'company',
    name: 'Company Registration',
    icon: '🏢',
    services: [
      {
        id: 'private_company',
        label: 'Private Limited Company Registration',
        description: 'Register a private limited company with the Registrar of Companies',
        price: 25000,
        category: 'company',
        estimatedTime: '7-10 business days',
        popular: true,
        requirements: [
          'Company name search and reservation',
          'Memorandum and Articles of Association',
          'Director and shareholder details',
          'Registered office address',
        ],
      },
      {
        id: 'public_company',
        label: 'Public Limited Company Registration',
        description: 'Register a public limited company for larger enterprises',
        price: 50000,
        category: 'company',
        estimatedTime: '10-15 business days',
        requirements: [
          'Minimum 7 shareholders',
          'Minimum authorized share capital',
          'Registered office in Kenya',
          'Company secretary',
        ],
      },
      {
        id: 'llp_registration',
        label: 'LLP (Limited Liability Partnership)',
        description: 'Register a Limited Liability Partnership',
        price: 20000,
        category: 'company',
        estimatedTime: '5-7 business days',
        popular: true,
      },
      {
        id: 'sole_proprietor',
        label: 'Sole Proprietorship Registration',
        description: 'Register as a sole proprietor/business name',
        price: 5000,
        category: 'company',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'partnership',
        label: 'Partnership Firm Registration',
        description: 'Register a traditional partnership firm',
        price: 8000,
        category: 'company',
        estimatedTime: '5-7 business days',
      },
      {
        id: 'ngo_registration',
        label: 'NGO Registration',
        description: 'Register a Non-Governmental Organization',
        price: 35000,
        category: 'company',
        estimatedTime: '14-21 business days',
        requirements: [
          'Constitution/Trust Deed',
          'Board of Trustees details',
          'Physical office address',
          'Registration with NGOs Board',
        ],
      },
    ],
  },
  {
    id: 'compliance',
    name: 'Annual Compliance',
    icon: '📋',
    services: [
      {
        id: 'annual_returns',
        label: 'Annual Returns Filing',
        description: 'File annual returns for your company',
        price: 5000,
        category: 'compliance',
        estimatedTime: '3-5 business days',
        popular: true,
      },
      {
        id: 'company_secretary',
        label: 'Company Secretary Services (Annual)',
        description: 'Annual company secretarial services',
        price: 15000,
        category: 'compliance',
        estimatedTime: 'Ongoing',
        hasVariablePrice: true,
        minPrice: 15000,
      },
      {
        id: 'director_changes',
        label: 'Director Changes/Updates',
        description: 'Add/remove directors or update their details',
        price: 3000,
        category: 'compliance',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'share_transfer',
        label: 'Share Transfer Processing',
        description: 'Process share transfers and updates',
        price: 5000,
        category: 'compliance',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'registered_office',
        label: 'Registered Office Change',
        description: 'Change of registered office address',
        price: 2000,
        category: 'compliance',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'constitution_amend',
        label: 'Constitution Amendments',
        description: 'Amend company constitution/M&A',
        price: 10000,
        category: 'compliance',
        estimatedTime: '5-7 business days',
      },
    ],
  },
  {
    id: 'licenses',
    name: 'Business Licenses & Permits',
    icon: '📜',
    services: [
      {
        id: 'single_business',
        label: 'Single Business Permit',
        description: 'Apply for county single business permit',
        price: 3000,
        category: 'licenses',
        estimatedTime: '5-7 business days',
        popular: true,
      },
      {
        id: 'export_license',
        label: 'Export/Import License',
        description: 'Apply for export/import license',
        price: 15000,
        category: 'licenses',
        estimatedTime: '10-14 business days',
      },
      {
        id: 'health_certificate',
        label: 'Health Certificate',
        description: 'Obtain health certificate for food businesses',
        price: 5000,
        category: 'licenses',
        estimatedTime: '7-10 business days',
      },
      {
        id: 'fire_clearance',
        label: 'Fire Safety Clearance',
        description: 'Fire safety inspection and clearance certificate',
        price: 4000,
        category: 'licenses',
        estimatedTime: '5-7 business days',
      },
      {
        id: 'ncaa_license',
        label: 'NCA Approved Contractor',
        description: 'NCA registration for construction companies',
        price: 25000,
        category: 'licenses',
        estimatedTime: '14-21 business days',
      },
      {
        id: 'insurance_broker',
        label: 'IRA Insurance Broker License',
        description: 'Insurance Regulatory Authority broker license',
        price: 35000,
        category: 'licenses',
        estimatedTime: '21-30 business days',
      },
    ],
  },
  {
    id: 'tax_registration',
    name: 'Tax Registration',
    icon: '💰',
    services: [
      {
        id: 'kra_pin_company',
        label: 'KRA PIN Registration (Company)',
        description: 'Register company for KRA PIN',
        price: 3000,
        category: 'tax_registration',
        estimatedTime: '2-3 business days',
        popular: true,
      },
      {
        id: 'vat_registration_biz',
        label: 'VAT Registration',
        description: 'Register company for VAT',
        price: 5000,
        category: 'tax_registration',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'paye_registration_biz',
        label: 'PAYE Registration',
        description: 'Register company for PAYE',
        price: 3000,
        category: 'tax_registration',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'withholding_tax_reg',
        label: 'Withholding Tax Registration',
        description: 'Register for withholding tax agent',
        price: 2500,
        category: 'tax_registration',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'excise_duty',
        label: 'Excise Duty License',
        description: 'Apply for excise duty license',
        price: 10000,
        category: 'tax_registration',
        estimatedTime: '10-14 business days',
      },
      {
        id: 'tax_clearance_biz',
        label: 'Tax Clearance Certificate',
        description: 'Apply for tax clearance certificate',
        price: 3500,
        category: 'tax_registration',
        estimatedTime: '3-5 business days',
      },
    ],
  },
  {
    id: 'specialized',
    name: 'Specialized Registrations',
    icon: '⭐',
    services: [
      {
        id: 'pharmacy_board',
        label: 'Pharmacy & Poisons Board',
        description: 'Register pharmacy/chemist business',
        price: 45000,
        category: 'specialized',
        estimatedTime: '21-30 business days',
      },
      {
        id: 'medical_practice',
        label: 'Medical Practitioners Board',
        description: 'Register medical practice/clinic',
        price: 35000,
        category: 'specialized',
        estimatedTime: '14-21 business days',
      },
      {
        id: 'engineering_board',
        label: 'Engineers Board Registration',
        description: 'Register engineering firm',
        price: 30000,
        category: 'specialized',
        estimatedTime: '14-21 business days',
      },
      {
        id: 'architects_board',
        label: 'Architects Board Registration',
        description: 'Register architecture firm',
        price: 28000,
        category: 'specialized',
        estimatedTime: '14-21 business days',
      },
      {
        id: 'legal_practice',
        label: 'Law Firm Registration',
        description: 'Register legal practice/advocates firm',
        price: 40000,
        category: 'specialized',
        estimatedTime: '14-21 business days',
      },
      {
        id: 'education_institution',
        label: 'Education Institution Registration',
        description: 'Register school/college/training institute',
        price: 50000,
        category: 'specialized',
        estimatedTime: '30-45 business days',
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
  requirements?: string[];
}

export default function BusinessServicesPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [activeCategory, setActiveCategory] = useState('company');

  // Load selected services from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('selectedBusinessServices');
    if (savedServices) {
      setSelectedServices(JSON.parse(savedServices));
    }
  }, []);

  // Save selected services to localStorage
  useEffect(() => {
    localStorage.setItem('selectedBusinessServices', JSON.stringify(selectedServices));
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
            requirements: service.requirements,
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
    localStorage.removeItem('selectedBusinessServices');
  };

  const handleAddToServiceRequest = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    // Format services for the service request
    const formattedServices = selectedServices.map(service => ({
      type: 'business',
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
        requirements: service.requirements,
      },
    }));

    // Save services to localStorage for the service request form
    localStorage.setItem(
      'pendingServiceRequest',
      JSON.stringify({
        serviceType: 'business',
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <button
              onClick={handleBackToServices}
              className="inline-flex items-center text-purple-100 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Services Page
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Registration Services</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Complete business setup solutions including company registration, licenses,
              compliance, and specialized registrations. Select multiple services and add them to
              your service request.
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
                        ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
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
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> All prices exclude government fees and statutory
                    charges. Some services require additional documentation. Our team will guide you
                    through the requirements.
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
                          ? 'border-purple-500 ring-2 ring-purple-200'
                          : 'border-transparent hover:border-purple-200 hover:shadow-lg'
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
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? <FiCheckCircle size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                        {/* Requirements (if any) */}
                        {service.requirements && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Requirements:
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {service.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-purple-500 mr-2">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                              {service.requirements.length > 3 && (
                                <li className="text-purple-600 font-medium">
                                  +{service.requirements.length - 3} more requirements
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Service Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-2" size={16} />
                            <span>{service.estimatedTime}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiBriefcase className="mr-2" size={16} />
                            <span className="capitalize">{service.category.replace('_', ' ')}</span>
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
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                            <span className="font-semibold text-purple-600">
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
                      className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center"
                    >
                      <span>Add to Service Request</span>
                      <FiArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        onClick={handleBackToServices}
                        className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
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
              className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors font-semibold flex items-center"
            >
              <FiShoppingCart className="mr-2" size={20} />
              <span>Add {selectedServices.length} Services</span>
              <span className="ml-3 bg-white text-purple-600 px-2 py-1 rounded-full text-sm">
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
            How Business Registration Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Services</h3>
              <p className="text-gray-600">Choose from our business registration services</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Request</h3>
              <p className="text-gray-600">Fill service request form with your details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Collection</h3>
              <p className="text-gray-600">We guide you through required documents</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing & Delivery</h3>
              <p className="text-gray-600">We process and deliver your registrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Types Information */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Common Business Structures in Kenya
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FiUsers className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Private Limited Company</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Limited liability protection
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Separate legal entity
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Minimum 1 director, 1 shareholder
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Perpetual succession
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <FiBriefcase className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sole Proprietorship</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Simple and quick registration
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Direct control by owner
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Minimal compliance requirements
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">⚠</span>
                  Unlimited liability
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <FiGlobe className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Limited Liability Partnership</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Limited liability for partners
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Flexible management structure
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Tax advantages
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Ideal for professional firms
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
