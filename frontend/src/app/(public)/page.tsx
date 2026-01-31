'use client';

import {
  FiCheckCircle,
  FiShield,
  FiGlobe,
  FiTrendingUp,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUsers,
} from 'react-icons/fi';
import Link from 'next/link';

const services = [
  {
    id: 'data',
    title: 'Data Analysis & Visualization',
    description: 'Transform raw data into actionable insights and beautiful visualizations',
    icon: FiTrendingUp,
    features: ['Data Mining', 'Data Cleaning', 'Statistical Analysis', 'Interactive Dashboards'],
    color: 'blue',
  },
  {
    id: 'business',
    title: 'Business Registration',
    description: 'Complete company registration and legal compliance services',
    icon: FiGlobe,
    features: [
      'Company Registration',
      'Business Name Search',
      'Legal Documentation',
      'Compliance Support',
    ],
    color: 'green',
  },
  {
    id: 'kra',
    title: 'KRA Services',
    description: 'Tax registration, filing, and compliance solutions',
    icon: FiCheckCircle,
    features: ['KRA PIN Registration', 'Tax Filing', 'Compliance Advisory', 'Drafting Services'],
    color: 'purple',
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping',
    description: 'Professional financial record keeping and reporting',
    icon: FiShield,
    features: ['Financial Recording', 'Expense Tracking', 'Financial Reports', 'Tax Preparation'],
    color: 'orange',
  },
];

const features = [
  {
    title: 'No Account Required',
    description: 'Submit service requests without creating an account',
    icon: FiUsers,
  },
  {
    title: 'Quick Response',
    description: 'Get expert response within 24 hours',
    icon: FiClock,
  },
  {
    title: 'Transparent Pricing',
    description: 'Clear pricing with no hidden fees',
    icon: FiDollarSign,
  },
  {
    title: 'Professional Service',
    description: 'Experienced professionals handle your requests',
    icon: FiCheckCircle,
  },
];

const steps = [
  {
    number: '01',
    title: 'Select Service',
    description: 'Choose from our professional services',
  },
  {
    number: '02',
    title: 'Fill Request Form',
    description: 'Tell us about your requirements',
  },
  {
    number: '03',
    title: 'Get Quote & Timeline',
    description: 'Receive professional assessment',
  },
  {
    number: '04',
    title: 'Service Delivery',
    description: 'Get quality service delivered',
  },
];

const testimonials = [
  {
    name: 'John Kamau',
    company: 'Nairobi Tech Solutions',
    content:
      'Their data analysis service helped us uncover insights that increased our sales by 35%. Professional and timely delivery.',
    rating: 5,
  },
  {
    name: 'Sarah Wanjiku',
    company: 'GreenFarm Enterprises',
    content:
      'Business registration was seamless. They handled all the paperwork and compliance issues efficiently.',
    rating: 5,
  },
  {
    name: 'David Ochieng',
    company: 'Maji Safi Logistics',
    content:
      'KRA services saved us countless hours of tax filing. Highly recommended for any business in Kenya.',
    rating: 5,
  },
];

export default function HomePage() {
  const handleServiceClick = (serviceId: string) => {
    // Redirect to service request form with service pre-selected
    window.location.href = `/services/${serviceId}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 md:py-25 overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Professional
              <span className="block text-primary-200 mt-2">Data & Business Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Get expert data analysis, business registration, KRA services, and bookkeeping
              <span className="block mt-2">
                <strong>
                  Submit your service request now and get expert assistance within 24 hours.
                </strong>
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = '/services')}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-700 hover:bg-gray-50 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <span>Request a Service</span>
                <FiArrowRight className="ml-2" size={20} />
              </button>
              <a
                href="services"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-700 transition-all"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive suite of services designed for businesses of all size.{' '}
              <br />
              No account required. Submit your service request now and get expert assistance within
              24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="p-6">
                  <div className={`text-${service.color}-600 mb-4`}>
                    <service.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <FiCheckCircle className="text-green-500 mr-2" size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full py-3 bg-primary-50 text-primary-700 rounded-lg font-semibold hover:bg-primary-100 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                      Request Service
                    </button>
                  </div>
                  <div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple process to get professional services without the hustle
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-1 bg-primary-200 -translate-y-1/2"></div>

            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
                  <span className="text-3xl font-bold text-primary-700">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make professional services accessible and hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of satisfied businesses who trust us with their professional needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add CSS for blob animation */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
