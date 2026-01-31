'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiFileText,
  FiShoppingCart,
  FiX,
  FiPlus,
  FiMinus,
  FiCheckCircle,
  FiCreditCard,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ServiceItem {
  type: 'kra' | 'data' | 'business' | 'other';
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details?: any;
}

interface PendingRequest {
  serviceType: string;
  services: ServiceItem[];
  totalAmount: number;
  timestamp: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  kraPin: string;
  idNumber: string;
  businessType: string;
  serviceType: 'kra' | 'data' | 'business' | 'other';
  priority: 'normal' | 'urgent' | 'express';
  deadline?: string;
  additionalNotes: string;
  services: ServiceItem[];
  totalAmount: number;
}

export default function ServiceRequestForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    kraPin: '',
    idNumber: '',
    businessType: '',
    serviceType: 'kra',
    priority: 'normal',
    deadline: '',
    additionalNotes: '',
    services: [],
    totalAmount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load pending service request from localStorage on mount
  useEffect(() => {
    const loadPendingRequest = () => {
      const pendingRequestStr = localStorage.getItem('pendingServiceRequest');
      if (pendingRequestStr) {
        try {
          const pendingRequest: PendingRequest = JSON.parse(pendingRequestStr);

          setFormData(prev => ({
            ...prev,
            serviceType: pendingRequest.serviceType as 'kra' | 'data' | 'business' | 'other',
            services: pendingRequest.services,
            totalAmount: pendingRequest.totalAmount,
          }));

          // Clear the pending request from localStorage
          localStorage.removeItem('pendingServiceRequest');
        } catch (error) {
          console.error('Error loading pending request:', error);
        }
      }
    };

    loadPendingRequest();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeService = (index: number) => {
    setFormData(prev => {
      const newServices = [...prev.services];
      newServices.splice(index, 1);

      const newTotalAmount = newServices.reduce((total, service) => total + service.totalPrice, 0);

      return {
        ...prev,
        services: newServices,
        totalAmount: newTotalAmount,
      };
    });
  };

  const updateServiceQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setFormData(prev => {
      const newServices = [...prev.services];
      const service = newServices[index];

      service.quantity = newQuantity;
      service.totalPrice = service.unitPrice * newQuantity;

      const newTotalAmount = newServices.reduce((total, s) => total + s.totalPrice, 0);

      return {
        ...prev,
        services: newServices,
        totalAmount: newTotalAmount,
      };
    });
  };

  const updateServicePrice = (index: number, newPrice: number) => {
    setFormData(prev => {
      const newServices = [...prev.services];
      const service = newServices[index];

      service.unitPrice = newPrice;
      service.totalPrice = newPrice * service.quantity;

      const newTotalAmount = newServices.reduce((total, s) => total + s.totalPrice, 0);

      return {
        ...prev,
        services: newServices,
        totalAmount: newTotalAmount,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (formData.services.length === 0) {
        toast.error('Please add at least one service to your request');
        setIsSubmitting(false);
        return;
      }

      if (!formData.email || !formData.phone || !formData.firstName) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Calculate total with priority fee
      const priorityMultiplier = formData.priority === 'express' ? 1.3 : 1;
      const totalWithFees = formData.totalAmount * priorityMultiplier;

      // Prepare request data for payment
      const requestData = {
        ...formData,
        totalWithFees,
        priorityMultiplier,
        submittedAt: new Date().toISOString(),
        status: 'pending_payment',
        referenceNumber: `SR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Save request to localStorage for payment page
      localStorage.setItem('serviceRequestForPayment', JSON.stringify(requestData));

      // Redirect to payment page
      router.push('/services/request/payment');
    } catch (error) {
      console.error('Error preparing for payment:', error);
      toast.error('Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited Company',
    'Public Limited Company',
    'LLP',
    'Non-Profit',
    'Other',
  ];

  // Calculate total with priority fee
  const priorityMultiplier = formData.priority === 'express' ? 1.3 : 1;
  const totalWithFees = formData.totalAmount * priorityMultiplier;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Request Form</h1>
          <p className="text-gray-600">
            Complete this form to submit your service request. Payment is required before
            processing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiBriefcase className="mr-2" />
                  Business Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">KRA PIN</label>
                    <input
                      type="text"
                      name="kraPin"
                      value={formData.kraPin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID/Passport Number
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiFileText className="mr-2" />
                  Service Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="kra">KRA Tax Services</option>
                      <option value="data">Data Services</option>
                      <option value="business">Business Registration</option>
                      <option value="other">Other Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="normal">Normal (3-5 business days)</option>
                      <option value="urgent">Urgent (1-2 business days)</option>
                      <option value="express">Express (24 hours) +30% fee</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide any additional information or specific requirements..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || formData.services.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
                  isSubmitting || formData.services.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  'Processing...'
                ) : (
                  <>
                    <FiCreditCard className="mr-2" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Selected Services Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiShoppingCart className="mr-2" />
                Selected Services
              </h2>

              {formData.services.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">No services selected yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Browse services and add them to your request
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {formData.services.map((service, index) => (
                      <div
                        key={`${service.type}-${service.serviceId}-${index}`}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  service.type === 'kra'
                                    ? 'bg-blue-500'
                                    : service.type === 'data'
                                      ? 'bg-green-500'
                                      : service.type === 'business'
                                        ? 'bg-purple-500'
                                        : 'bg-gray-500'
                                }`}
                              />
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {service.type}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 mt-1 line-clamp-2">
                              {service.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeService(index)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <FiX size={18} />
                          </button>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center">
                              <button
                                onClick={() => updateServiceQuantity(index, service.quantity - 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={service.quantity <= 1}
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="mx-2 min-w-[2rem] text-center">
                                {service.quantity}
                              </span>
                              <button
                                onClick={() => updateServiceQuantity(index, service.quantity + 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>
                          </div>

                          {service.details?.hasVariablePrice && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Unit Price (KES)
                              </label>
                              <input
                                type="number"
                                min={service.details?.minPrice || 0}
                                value={service.unitPrice}
                                onChange={e => updateServicePrice(index, Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-900">Total:</span>
                            <span className="font-semibold text-blue-600">
                              KES {service.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="text-lg font-bold text-gray-900">
                        KES {formData.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {formData.priority === 'express' && (
                      <div className="flex justify-between items-center text-sm text-orange-600 mb-2">
                        <span>Express fee (30%):</span>
                        <span>KES {(formData.totalAmount * 0.3).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">KES {totalWithFees.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Browse More Services Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/services')}
                      className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Browse More Services
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Important Notes */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <FiCheckCircle className="mr-2" />
                Payment Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Payment is required before processing</li>
                <li>• You'll be redirected to payment page</li>
                <li>• Secure payment processing</li>
                <li>• Receipt will be emailed to you</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
