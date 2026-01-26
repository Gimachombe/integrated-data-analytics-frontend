'use client';

import {
  FiTrendingUp,
  FiFileText,
  FiCheckCircle,
  FiBriefcase,
  FiDollarSign,
  FiShield,
  FiUsers,
  FiGlobe,
} from 'react-icons/fi';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';

const services = [
  {
    title: 'Data Services',
    description: 'Data mining, cleaning, collection, and analysis services',
    href: '/data-services',
    icon: FiTrendingUp,
    color: 'blue' as const,
    features: ['Data Mining', 'Data Cleaning', 'Data Collection', 'Data Analysis'],
    price: 'Starting from KES 5,000',
  },
  {
    title: 'Business Registration',
    description: 'Company and business name registration with full compliance',
    href: '/business-registration',
    icon: FiFileText,
    color: 'green' as const,
    features: ['Name Search', 'Company Incorporation', 'Compliance Support', 'Document Filing'],
    price: 'Starting from KES 2,500',
  },
  {
    title: 'KRA Services',
    description: 'Complete tax compliance solutions and advisory services',
    href: '/kra-services',
    icon: FiCheckCircle,
    color: 'purple' as const,
    features: ['PIN Registration', 'Tax Filing', 'Compliance Certificates', 'Tax Advisory'],
    price: 'Starting from KES 1,500',
  },
  {
    title: 'Bookkeeping',
    description: 'Professional financial record keeping and audit preparation',
    href: '/bookkeeping',
    icon: FiBriefcase,
    color: 'orange' as const,
    features: ['Monthly Bookkeeping', 'Financial Reports', 'Tax Preparation', 'Audit Support'],
    price: 'Starting from KES 5,000/month',
  },
  {
    title: 'Company Maintenance',
    description: 'Ongoing compliance and annual returns filing',
    href: '/company-maintenance',
    icon: FiShield,
    color: 'red' as const,
    features: ['Annual Returns', 'Compliance Tracking', 'Company Updates', 'Record Management'],
    price: 'Starting from KES 3,000/year',
  },
  {
    title: 'Consultation Services',
    description: 'Professional business and data strategy consultation',
    href: '/consultation',
    icon: FiUsers,
    color: 'indigo' as const,
    features: ['Business Strategy', 'Data Strategy', 'Compliance Audit', 'Growth Planning'],
    price: 'KES 10,000/session',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Select Service',
    description: 'Choose from our wide range of professional services',
    icon: FiGlobe,
  },
  {
    step: '02',
    title: 'Submit Request',
    description: 'Fill out the service request form with your requirements',
    icon: FiFileText,
  },
  {
    step: '03',
    title: 'Processing',
    description: 'Our experts process your request with care and precision',
    icon: FiTrendingUp,
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Receive completed work and comprehensive reports',
    icon: FiCheckCircle,
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Our Professional <span className="text-primary-600 dark:text-primary-400">Services</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Comprehensive data analytics and business services designed to help your business thrive.
          From registration to compliance, we've got you covered.
        </p>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Services</h2>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>All Categories</option>
              <option>Data Services</option>
              <option>Business Services</option>
              <option>Financial Services</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div
              key={service.title}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div
                  className={`inline-flex p-3 rounded-lg mb-4 ${
                    service.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : service.color === 'green'
                        ? 'bg-green-100 dark:bg-green-900'
                        : service.color === 'purple'
                          ? 'bg-purple-100 dark:bg-purple-900'
                          : service.color === 'orange'
                            ? 'bg-orange-100 dark:bg-orange-900'
                            : service.color === 'red'
                              ? 'bg-red-100 dark:bg-red-900'
                              : 'bg-indigo-100 dark:bg-indigo-900'
                  }`}
                >
                  <service.icon
                    className={
                      service.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : service.color === 'green'
                          ? 'text-green-600 dark:text-green-400'
                          : service.color === 'purple'
                            ? 'text-purple-600 dark:text-purple-400'
                            : service.color === 'orange'
                              ? 'text-orange-600 dark:text-orange-400'
                              : service.color === 'red'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-indigo-600 dark:text-indigo-400'
                    }
                    size={24}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Includes:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                      >
                        <FiCheckCircle
                          className="mr-2 text-green-500 dark:text-green-400"
                          size={14}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Starting at</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {service.price}
                    </p>
                  </div>
                  <Link
                    href={service.href}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Simple, transparent process from start to finish
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map(step => (
            <div key={step.step} className="text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {step.step}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                  <step.icon className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that trust us with their data and compliance needs. Start
          with our risk-free trial today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Register Now
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-white border border-white hover:bg-primary-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Service Questions
            </h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  How long does service delivery take?
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Service delivery time varies by service. Data services typically take 3-5 business
                  days, while business registration takes 5-7 business days.
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Can I cancel a service?
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel most services within 24 hours of purchase for a full refund.
                  Some specialized services may have different cancellation policies.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment & Support
            </h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept M-Pesa, credit/debit cards (Visa, Mastercard), and bank transfers. All
                  payments are secure and encrypted.
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Is technical support included?
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, all our services include email and chat support. We also have phone support
                  and priority assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
