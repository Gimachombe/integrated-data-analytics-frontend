'use client';

import { useState, useEffect } from 'react';
import {
  FiGlobe,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
  FiCode,
  FiMonitor,
  FiServer,
  FiShield,
  FiShoppingBag,
  FiTrendingUp,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const serviceCategories = [
  {
    id: 'creation',
    name: 'Website Creation & Development',
    icon: '🚀',
    services: [
      {
        id: 'basic_website',
        label: 'Basic Business Website',
        description: '5-page responsive website with contact form, about, services, and home page',
        price: 25000,
        category: 'creation',
        estimatedTime: '7-10 business days',
        popular: true,
        features: [
          '5 custom designed pages',
          'Mobile responsive design',
          'Contact form with email',
          'Basic SEO optimization',
          '1-year hosting included',
          'Domain registration (1 year)',
        ],
      },
      {
        id: 'ecommerce_website',
        label: 'E-commerce Website',
        description: 'Complete online store with product management, cart, and payment integration',
        price: 75000,
        category: 'creation',
        estimatedTime: '15-20 business days',
        popular: true,
        features: [
          'Unlimited products',
          'Shopping cart & checkout',
          'Payment gateway integration',
          'Inventory management',
          'Order tracking system',
          'Admin dashboard',
        ],
      },
      {
        id: 'corporate_website',
        label: 'Corporate Website',
        description: 'Professional corporate website with advanced features and CMS',
        price: 50000,
        category: 'creation',
        estimatedTime: '10-15 business days',
        features: [
          '10+ custom pages',
          'Content Management System',
          'Blog/news section',
          'Team/profile pages',
          'Gallery/portfolio',
          'Advanced contact forms',
        ],
      },
      {
        id: 'landing_page',
        label: 'Landing Page Design',
        description: 'Single high-converting landing page for campaigns or product launches',
        price: 15000,
        category: 'creation',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'website_redesign',
        label: 'Website Redesign',
        description: 'Modern redesign of your existing website with improved UX/UI',
        price: 30000,
        category: 'creation',
        estimatedTime: '10-14 business days',
      },
      {
        id: 'custom_web_app',
        label: 'Custom Web Application',
        description: 'Bespoke web application development with custom functionality',
        price: 150000,
        category: 'creation',
        estimatedTime: '30-45 business days',
        hasVariablePrice: true,
        minPrice: 150000,
      },
    ],
  },
  {
    id: 'maintenance',
    name: 'Website Maintenance & Support',
    icon: '🔧',
    services: [
      {
        id: 'basic_maintenance',
        label: 'Basic Website Maintenance (Monthly)',
        description: 'Monthly maintenance including updates, backups, and basic support',
        price: 5000,
        category: 'maintenance',
        estimatedTime: 'Ongoing',
        popular: true,
        features: [
          'Weekly backups',
          'Security updates',
          'Plugin/theme updates',
          'Uptime monitoring',
          'Basic content updates (up to 2 hours)',
          'Email support',
        ],
      },
      {
        id: 'premium_maintenance',
        label: 'Premium Maintenance (Monthly)',
        description: 'Comprehensive maintenance with priority support and advanced features',
        price: 10000,
        category: 'maintenance',
        estimatedTime: 'Ongoing',
        features: [
          'Daily backups',
          'Advanced security monitoring',
          'Performance optimization',
          'SEO maintenance',
          'Content updates (up to 5 hours)',
          'Priority support',
        ],
      },
      {
        id: 'hourly_support',
        label: 'Hourly Technical Support',
        description: 'Pay-as-you-go technical support for your website',
        price: 2000,
        category: 'maintenance',
        estimatedTime: 'As needed',
        hasVariablePrice: true,
        minPrice: 2000,
      },
      {
        id: 'emergency_fix',
        label: 'Emergency Website Fix',
        description: 'Urgent fix for critical website issues (hacking, downtime, etc.)',
        price: 10000,
        category: 'maintenance',
        estimatedTime: '24 hours',
      },
      {
        id: 'content_updates',
        label: 'Content Update Package',
        description: 'Monthly content updates for your website',
        price: 8000,
        category: 'maintenance',
        estimatedTime: 'Monthly',
        hasVariablePrice: true,
        minPrice: 8000,
      },
      {
        id: 'backup_restore',
        label: 'Website Backup & Restore Service',
        description: 'Comprehensive backup solution with restore capability',
        price: 3000,
        category: 'maintenance',
        estimatedTime: 'Monthly',
      },
    ],
  },
  {
    id: 'hosting',
    name: 'Hosting & Domain Services',
    icon: '🌐',
    services: [
      {
        id: 'shared_hosting',
        label: 'Shared Web Hosting (Annual)',
        description: 'Reliable shared hosting for small to medium websites',
        price: 12000,
        category: 'hosting',
        estimatedTime: '24 hours setup',
        popular: true,
        features: [
          '10GB SSD Storage',
          'Unlimited bandwidth',
          '100 Email accounts',
          'Free SSL certificate',
          '99.9% uptime guarantee',
          'cPanel control panel',
        ],
      },
      {
        id: 'vps_hosting',
        label: 'VPS Hosting (Monthly)',
        description: 'Virtual Private Server hosting for growing businesses',
        price: 8000,
        category: 'hosting',
        estimatedTime: '24 hours setup',
        features: [
          '2GB RAM, 50GB SSD',
          '2 CPU cores',
          'Unlimited bandwidth',
          'Root access',
          'Daily backups',
          'Dedicated IP',
        ],
      },
      {
        id: 'domain_registration',
        label: 'Domain Name Registration',
        description: 'Register your perfect domain name (.com, .co.ke, .org, etc.)',
        price: 1500,
        category: 'hosting',
        estimatedTime: '24 hours',
      },
      {
        id: 'ssl_certificate',
        label: 'SSL Certificate (Annual)',
        description: 'Secure your website with SSL certificate',
        price: 3000,
        category: 'hosting',
        estimatedTime: '24 hours',
      },
      {
        id: 'email_hosting',
        label: 'Business Email Hosting (Annual)',
        description: 'Professional email hosting with your domain',
        price: 6000,
        category: 'hosting',
        estimatedTime: '24 hours',
        features: [
          '10GB email storage',
          '25 email accounts',
          'Webmail access',
          'Spam protection',
          'Mobile sync',
          'Email forwarding',
        ],
      },
      {
        id: 'wordpress_hosting',
        label: 'Managed WordPress Hosting',
        description: 'Optimized hosting specifically for WordPress websites',
        price: 18000,
        category: 'hosting',
        estimatedTime: '24 hours setup',
        popular: true,
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Digital Marketing & SEO',
    icon: '📈',
    services: [
      {
        id: 'seo_audit',
        label: 'SEO Website Audit',
        description: 'Comprehensive SEO analysis and optimization recommendations',
        price: 15000,
        category: 'marketing',
        estimatedTime: '5-7 business days',
        features: [
          'Technical SEO analysis',
          'On-page optimization review',
          'Competitor analysis',
          'Keyword research',
          'Performance report',
          'Action plan',
        ],
      },
      {
        id: 'seo_monthly',
        label: 'Monthly SEO Services',
        description: 'Ongoing SEO optimization to improve search rankings',
        price: 20000,
        category: 'marketing',
        estimatedTime: 'Monthly',
        hasVariablePrice: true,
        minPrice: 20000,
      },
      {
        id: 'google_ads',
        label: 'Google Ads Setup & Management',
        description: 'Create and manage Google Ads campaigns',
        price: 10000,
        category: 'marketing',
        estimatedTime: '3-5 business days',
        hasVariablePrice: true,
        minPrice: 10000,
      },
      {
        id: 'social_media_setup',
        label: 'Social Media Integration',
        description: 'Integrate social media with your website and create profiles',
        price: 8000,
        category: 'marketing',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'content_marketing',
        label: 'Content Marketing Package',
        description: 'Regular blog posts and content creation for SEO',
        price: 15000,
        category: 'marketing',
        estimatedTime: 'Monthly',
        hasVariablePrice: true,
        minPrice: 15000,
      },
      {
        id: 'analytics_setup',
        label: 'Analytics & Tracking Setup',
        description: 'Set up Google Analytics, Search Console, and tracking codes',
        price: 5000,
        category: 'marketing',
        estimatedTime: '2-3 business days',
      },
    ],
  },
  {
    id: 'security',
    name: 'Security & Protection',
    icon: '🛡️',
    services: [
      {
        id: 'security_audit',
        label: 'Website Security Audit',
        description: 'Comprehensive security assessment and vulnerability testing',
        price: 20000,
        category: 'security',
        estimatedTime: '5-7 business days',
      },
      {
        id: 'malware_removal',
        label: 'Malware Removal & Cleanup',
        description: 'Remove malware, viruses, and hack attempts from your website',
        price: 15000,
        category: 'security',
        estimatedTime: '1-3 business days',
      },
      {
        id: 'firewall_setup',
        label: 'Web Application Firewall',
        description: 'Set up and configure WAF for enhanced security',
        price: 10000,
        category: 'security',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'security_monitoring',
        label: '24/7 Security Monitoring',
        description: 'Continuous security monitoring and threat detection',
        price: 12000,
        category: 'security',
        estimatedTime: 'Monthly',
      },
      {
        id: 'backup_solution',
        label: 'Automated Backup Solution',
        description: 'Set up automated daily/weekly backups with cloud storage',
        price: 8000,
        category: 'security',
        estimatedTime: '2-3 business days',
      },
      {
        id: 'ssl_setup',
        label: 'SSL Certificate Setup & Renewal',
        description: 'Install and configure SSL certificates with auto-renewal',
        price: 4000,
        category: 'security',
        estimatedTime: '24 hours',
      },
    ],
  },
  {
    id: 'training',
    name: 'Training & Consulting',
    icon: '🎓',
    services: [
      {
        id: 'website_training',
        label: 'Website Management Training',
        description: 'Train your team to manage and update your website',
        price: 10000,
        category: 'training',
        estimatedTime: '4 hours',
        hasVariablePrice: true,
        minPrice: 10000,
      },
      {
        id: 'seo_training',
        label: 'SEO Fundamentals Training',
        description: 'Learn basic SEO techniques to improve your website visibility',
        price: 15000,
        category: 'training',
        estimatedTime: '6 hours',
      },
      {
        id: 'analytics_training',
        label: 'Google Analytics Training',
        description: 'Learn to analyze website traffic and user behavior',
        price: 12000,
        category: 'training',
        estimatedTime: '4 hours',
      },
      {
        id: 'content_creation',
        label: 'Content Creation Workshop',
        description: 'Learn to create engaging content for your website',
        price: 10000,
        category: 'training',
        estimatedTime: '5 hours',
      },
      {
        id: 'social_media_training',
        label: 'Social Media Marketing Training',
        description: 'Learn to effectively use social media for business',
        price: 15000,
        category: 'training',
        estimatedTime: '6 hours',
      },
      {
        id: 'consulting_hourly',
        label: 'Website Consulting (Hourly)',
        description: 'One-on-one consulting for your website strategy',
        price: 3000,
        category: 'training',
        estimatedTime: 'Per hour',
        hasVariablePrice: true,
        minPrice: 3000,
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
  features?: string[];
}

export default function WebsiteServicesPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [activeCategory, setActiveCategory] = useState('creation');

  // Load selected services from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('selectedWebsiteServices');
    if (savedServices) {
      setSelectedServices(JSON.parse(savedServices));
    }
  }, []);

  // Save selected services to localStorage
  useEffect(() => {
    localStorage.setItem('selectedWebsiteServices', JSON.stringify(selectedServices));
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
            features: service.features,
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
    localStorage.removeItem('selectedWebsiteServices');
  };

  const handleAddToServiceRequest = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    // Format services for the service request
    const formattedServices = selectedServices.map(service => ({
      type: 'website',
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
        features: service.features,
      },
    }));

    // Save services to localStorage for the service request form
    localStorage.setItem(
      'pendingServiceRequest',
      JSON.stringify({
        serviceType: 'website',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <button
              onClick={handleBackToServices}
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Services Page
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Website Development Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Complete website solutions including creation, maintenance, hosting, and digital
              marketing. Build your online presence with our professional services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
              <div className="space-y-2">
                {serviceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
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
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiShield className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-blue-900">
                    Professional Web Solutions
                  </h3>
                  <p className="text-sm text-blue-800 mt-1">
                    All websites include responsive design, SEO optimization, and 1-month free
                    support. Custom requirements can be discussed with our team.
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
                      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-transparent hover:border-blue-200'
                      }`}
                    >
                      <div className="p-6">
                        {/* Service Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{service.label}</h3>
                            {service.popular && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-medium">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleServiceClick(service)}
                            className={`p-2.5 rounded-full transition-all duration-200 ${
                              isSelected
                                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? <FiCheckCircle size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Features (if any) */}
                        {service.features && (
                          <div className="mb-5 bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                              <FiCheckCircle className="mr-2 text-blue-600" size={14} />
                              Included Features:
                            </h4>
                            <ul className="text-xs text-blue-800 space-y-1.5">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                              {service.features.length > 3 && (
                                <li className="text-blue-600 font-medium pt-1">
                                  +{service.features.length - 3} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Service Details */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiClock className="mr-2" size={16} />
                              <span>{service.estimatedTime}</span>
                            </div>
                            {service.hasVariablePrice && (
                              <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <FiTrendingUp className="mr-1" size={14} />
                                Variable Pricing
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              KES {service.price.toLocaleString()}
                            </div>
                            {service.hasVariablePrice && (
                              <div className="text-xs text-gray-500">Starting from</div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {isSelected && selectedService ? (
                            <div className="flex items-center space-x-4 w-full">
                              <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateServiceQuantity(service.id, selectedService.quantity - 1);
                                  }}
                                  className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                                >
                                  <FiMinus size={18} />
                                </button>
                                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                  {selectedService.quantity}
                                </span>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateServiceQuantity(service.id, selectedService.quantity + 1);
                                  }}
                                  className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                >
                                  <FiPlus size={18} />
                                </button>
                              </div>

                              {service.hasVariablePrice && selectedService && (
                                <div className="flex-1">
                                  <div className="text-xs text-gray-600 mb-1">
                                    Custom Price (KES)
                                  </div>
                                  <input
                                    type="number"
                                    min={service.minPrice}
                                    value={selectedService.customPrice || service.price}
                                    onChange={e =>
                                      updateServicePrice(service.id, Number(e.target.value))
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onClick={e => e.stopPropagation()}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleServiceClick(service)}
                              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center"
                            >
                              <FiPlus className="mr-2" />
                              Add to Selection
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
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiShoppingCart className="mr-2 text-blue-600" />
                  Selected Services
                </h3>
                {selectedServices.length > 0 && (
                  <button
                    onClick={clearAllServices}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedServices.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FiGlobe className="text-blue-600" size={28} />
                  </div>
                  <p className="text-gray-500 font-medium">No services selected</p>
                  <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                    Select website services from the list to build your online presence
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {selectedServices.map(service => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  service.category === 'creation'
                                    ? 'bg-blue-500'
                                    : service.category === 'maintenance'
                                      ? 'bg-green-500'
                                      : service.category === 'hosting'
                                        ? 'bg-purple-500'
                                        : service.category === 'marketing'
                                          ? 'bg-orange-500'
                                          : service.category === 'security'
                                            ? 'bg-red-500'
                                            : 'bg-gray-500'
                                }`}
                              />
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {service.category}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {service.label}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeService(service.id)}
                            className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
                          >
                            ×
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Quantity:</span>
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateServiceQuantity(service.id, service.quantity - 1)
                                }
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                disabled={service.quantity <= 1}
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="mx-3 min-w-[2rem] text-center font-medium">
                                {service.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateServiceQuantity(service.id, service.quantity + 1)
                                }
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Item Total:</span>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <FiClock className="mr-1" size={10} />
                                {service.estimatedTime}
                              </div>
                            </div>
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
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-gray-700 font-medium">Subtotal:</span>
                        <p className="text-xs text-gray-500">
                          {selectedServices.length} service(s)
                        </p>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        KES {totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleAddToServiceRequest}
                      className="w-full mt-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <span>Proceed to Request</span>
                      <FiArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        onClick={handleBackToServices}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        ← Back to All Services
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Stats */}
            {selectedServices.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Selection Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Total Services:</span>
                    <span className="font-medium text-blue-900">{selectedServices.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Categories:</span>
                    <span className="font-medium text-blue-900">
                      {[...new Set(selectedServices.map(s => s.category))].length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Monthly Services:</span>
                    <span className="font-medium text-blue-900">
                      {selectedServices.filter(s => s.estimatedTime?.includes('Monthly')).length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Cart Button (Mobile) */}
        {selectedServices.length > 0 && (
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={handleAddToServiceRequest}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center"
            >
              <FiShoppingCart className="mr-2" size={20} />
              <span>Add {selectedServices.length} Services</span>
              <span className="ml-3 bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
                KES {totalAmount.toLocaleString()}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Website Development Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiGlobe className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery & Planning</h3>
              <p className="text-gray-600">
                We understand your business needs and plan the perfect solution
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiCode className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Development</h3>
              <p className="text-gray-600">
                Create responsive, modern designs and develop robust functionality
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiMonitor className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing & Launch</h3>
              <p className="text-gray-600">Rigorous testing and smooth launch with full support</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiServer className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance & Support</h3>
              <p className="text-gray-600">Ongoing maintenance, updates, and 24/7 support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Technologies We Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'React/Next.js', color: 'bg-blue-100 text-blue-800' },
              { name: 'WordPress', color: 'bg-blue-200 text-blue-900' },
              { name: 'Node.js', color: 'bg-green-100 text-green-800' },
              { name: 'PHP/Laravel', color: 'bg-red-100 text-red-800' },
              { name: 'Python/Django', color: 'bg-emerald-100 text-emerald-800' },
              { name: 'Shopify', color: 'bg-green-200 text-green-900' },
              { name: 'WooCommerce', color: 'bg-purple-100 text-purple-800' },
              { name: 'MongoDB', color: 'bg-green-100 text-green-800' },
              { name: 'MySQL', color: 'bg-orange-100 text-orange-800' },
              { name: 'AWS', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Google Cloud', color: 'bg-blue-100 text-blue-800' },
              { name: 'Docker', color: 'bg-blue-200 text-blue-900' },
            ].map((tech, index) => (
              <div
                key={index}
                className={`${tech.color} rounded-xl p-4 text-center font-medium shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
