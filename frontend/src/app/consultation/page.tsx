'use client';

import { useState } from 'react';
import { FiUsers, FiCalendar, FiClock, FiVideo, FiMapPin, FiMail } from 'react-icons/fi';

const consultationTypes = [
  {
    id: 'business_strategy',
    title: 'Business Strategy',
    description: 'Develop a winning business strategy for growth',
    duration: '60 minutes',
    price: 10000,
    features: ['Market Analysis', 'Growth Planning', 'Competitor Analysis', 'Strategy Development'],
  },
  {
    id: 'data_strategy',
    title: 'Data Strategy',
    description: 'Create a data-driven strategy for your business',
    duration: '90 minutes',
    price: 15000,
    features: ['Data Assessment', 'Analytics Planning', 'Implementation Roadmap', 'ROI Analysis'],
  },
  {
    id: 'compliance_audit',
    title: 'Compliance Audit',
    description: 'Comprehensive compliance health check',
    duration: '120 minutes',
    price: 20000,
    features: ['Regulatory Review', 'Gap Analysis', 'Remediation Plan', 'Compliance Reporting'],
  },
];

const consultants = [
  {
    name: 'John Mwangi',
    role: 'Business Strategy Expert',
    experience: '15+ years',
    specialization: 'Business Growth & Strategy',
  },
  {
    name: 'Sarah Akinyi',
    role: 'Data Analytics Specialist',
    experience: '12+ years',
    specialization: 'Data Strategy & Analytics',
  },
  {
    name: 'David Ochieng',
    role: 'Compliance Consultant',
    experience: '10+ years',
    specialization: 'Regulatory Compliance',
  },
];

export default function ConsultationPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    date: '',
    time: '',
    consultationType: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Consultation request submitted successfully! Our team will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      date: '',
      time: '',
      consultationType: '',
      notes: '',
    });
    setSelectedType(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Professional Consultation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Get expert advice from our experienced consultants to drive your business forward
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consultation Types */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Consultation Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultationTypes.map(type => (
              <div
                key={type.id}
                className={`bg-white dark:bg-gray-800 border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'border-primary-500 ring-2 ring-primary-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
                onClick={() => {
                  setSelectedType(type.id);
                  setFormData({ ...formData, consultationType: type.id });
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">
                    <FiUsers className="text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What You Get:
                  </h4>
                  <ul className="space-y-1">
                    {type.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiClock className="mr-2" />
                      {type.duration}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    KES {type.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Our Consultants */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Our Consultants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {consultants.map((consultant, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
                >
                  <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="text-primary-600 dark:text-primary-400" size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {consultant.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">{consultant.role}</p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Experience: {consultant.experience}</p>
                    <p>Specialization: {consultant.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Book a Consultation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Date *
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Time *
                </label>
                <select
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Consultation Type
                </label>
                <select
                  value={formData.consultationType}
                  onChange={e => setFormData({ ...formData, consultationType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select type</option>
                  {consultationTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.title} - KES {type.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Tell us about your business and what you hope to achieve..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Book Consultation
                </button>
              </div>
            </form>

            {/* Consultation Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FiVideo className="mr-2" />
                <span>Consultations available via video call or in-person</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FiClock className="mr-2" />
                <span>Flexible scheduling available</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FiMapPin className="mr-2" />
                <span>Nairobi CBD location available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
