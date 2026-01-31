'use client';

import { FiTrendingUp, FiFileText, FiGlobe, FiBriefcase, FiDollarSign, FiCheckCircle, FiDatabase } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const serviceCategories = [
  {
    id: 'kra',
    title: 'KRA Tax Services',
    description: 'Tax registration, filing, compliance, and advisory services',
    icon: <FiTrendingUp className="text-blue-600" size={32} />,
    color: 'blue',
    services: [
      'KRA PIN Registration',
      'Tax Returns Filing',
      'VAT & PAYE Registration',
      'Tax Clearance Certificates',
      'Tax Advisory',
    ],
    path: '/services/kra',
  },
  {
    id: 'business',
    title: 'Business Services',
    description: 'Company registration and business compliance',
    icon: <FiBriefcase className="text-purple-600" size={32} />,
    color: 'purple',
    services: [
      'Company Registration',
      'Business Name Search',
      'Annual Compliance',
      'Business Licenses',
      'Specialized Registrations',
    ],
    path: '/services/business',
  },
  {
    id: 'website',
    title: 'Website Development',
    description: 'Website creation, maintenance, hosting, and digital marketing',
    icon: <FiGlobe className="text-indigo-600" size={32} />,
    color: 'gray',
    services: [
      'Website Design & Development',
      'E-commerce Solutions',
      'Website Maintenance',
      'Hosting & Domain Services',
      'SEO & Digital Marketing',
      'Website Security',
    ],
    path: '/services/website',
  },
  {
    id: 'data',
    title: 'Data & Analytics Services',
    description: 'Data collection, cleaning, analysis, visualization, and AI solutions',
    icon: <FiDatabase className="text-cyan-600" size={32} />,
    color: 'cyan',
    services: [
      'Data Collection & Mining',
      'Data Cleaning & Preparation',
      'Data Analysis & Insights',
      'Data Visualization',
      'Machine Learning & AI',
      'Data Warehousing',
    ],
    path: '/services/data',
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping Services',
    description: 'Complete bookkeeping, financial reporting, and accounting solutions',
    icon: <FiDollarSign className="text-green-600" size={32} />,
    color: 'green',
    services: [
      'Transaction Recording',
      'Financial Statements',
      'Bank Reconciliation',
      'Payroll Processing',
      'Accounting Software Setup',
    ],
    path: '/services/bookkeeping',
  },
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive professional services tailored to your needs. Select from our range of
              KRA tax services, data solutions, business services, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map(category => (
            <div
              key={category.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-${category.color}-500 transition-all duration-300 hover:shadow-xl cursor-pointer`}
              onClick={() => router.push(category.path)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-${category.color}-50`}>{category.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{category.description}</p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Services Include:</h4>
                  <ul className="space-y-1">
                    {category.services.map((service, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <FiCheckCircle className="mr-2 text-green-500" size={14} />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-2 px-4 bg-${category.color}-600 text-white rounded-lg font-medium hover:bg-${category.color}-700 transition-colors`}
                >
                  Browse Services
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How to Request Services
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Services</h3>
              <p className="text-gray-600">Select a service category that fits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add to Request</h3>
              <p className="text-gray-600">Select services and add them to your request</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fill Form</h3>
              <p className="text-gray-600">Complete the service request form</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Service</h3>
              <p className="text-gray-600">Our team contacts you within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
