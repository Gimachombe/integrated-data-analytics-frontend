'use client';

import { FiCheckCircle, FiShield, FiGlobe, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    name: 'Data Analytics',
    description:
      'Professional data mining, cleaning, collection, and analysis services tailored to your business needs.',
    icon: FiTrendingUp,
  },
  {
    name: 'Business Registration',
    description:
      'Streamlined company and business name registration services with full compliance support.',
    icon: FiGlobe,
  },
  {
    name: 'KRA Services',
    description:
      'Complete tax compliance solutions including PIN registration, filing, and advisory services.',
    icon: FiCheckCircle,
  },
  {
    name: 'Secure & Reliable',
    description:
      'Bank-grade security with end-to-end encryption to protect your sensitive business data.',
    icon: FiShield,
  },
];

const services = [
  {
    title: 'Data Services',
    description: 'Transform raw data into actionable insights',
    href: '/data-services',
    icon: FiTrendingUp,
    color: 'blue' as const,
  },
  {
    title: 'Business Registration',
    description: 'Register your business quickly and compliantly',
    href: '/business-registration',
    icon: FiGlobe,
    color: 'green' as const,
  },
  {
    title: 'KRA Services',
    description: 'Stay compliant with all tax requirements',
    href: '/kra-services',
    icon: FiCheckCircle,
    color: 'purple' as const,
  },
  {
    title: 'Bookkeeping',
    description: 'Professional financial record keeping',
    href: '/bookkeeping',
    icon: FiShield,
    color: 'orange' as const,
  },
];

const stats = [
  { label: 'Happy Clients', value: '500+' },
  { label: 'Projects Completed', value: '1200+' },
  { label: 'Data Processes', value: '50K+' },
  { label: 'Business Registered', value: '300+' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              One-Stop Digital Solution for{' '}
              <span className="text-primary-600 dark:text-primary-400">
                Data & Business Services
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
              Professional data analytics and business compliance services for individuals,
              startups, SMEs, and corporate clients. All in one integrated platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? '/dashboard' : '/register'}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                {user ? 'Go to Dashboard' : 'Register to Access Our Services'}
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 border border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
              >
                View All Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-1 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose from our professional services designed to help your business thrive
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <div
                key={service.title}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className={`text-${service.color}-600 dark:text-${service.color}-400 mb-4`}>
                  <service.icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{service.description}</p>
                <div className="mt-4">
                  <Link
                    href={service.href}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From data analytics to business compliance, we've got you covered with our
              comprehensive suite of services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(feature => (
              <div
                key={feature.name}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl mx-4 lg:mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses that trust us with their data and compliance needs. Start
            your journey today with our 14-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-primary-600 dark:text-primary-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-white border border-white hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
