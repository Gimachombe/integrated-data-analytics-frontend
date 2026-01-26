'use client';

import { useState } from 'react';
import {
  FiHelpCircle,
  FiMessageSquare,
  FiFileText,
  FiPhone,
  FiMail,
  FiClock,
} from 'react-icons/fi';

const faqs = [
  {
    question: 'How do I register my business?',
    answer:
      'Navigate to Business Registration page, fill out the form, upload required documents, and submit. Our team will process your request within 5-7 business days.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept M-Pesa, credit/debit cards (Visa, Mastercard), and bank transfers. All payments are secure and encrypted.',
  },
  {
    question: 'How long does KRA PIN registration take?',
    answer:
      'KRA PIN registration typically takes 3-5 business days. You will receive your PIN via email once processed.',
  },
  {
    question: 'Can I track my service request?',
    answer:
      'Yes, you can track all your service requests from your dashboard. Each request has a unique tracking number.',
  },
  {
    question: 'How do I upload documents?',
    answer:
      'Go to the specific service page and use the document upload section. We accept PDF, JPG, PNG files up to 10MB.',
  },
];

const supportChannels = [
  {
    icon: FiMessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    availability: 'Available 24/7',
    action: 'Start Chat',
  },
  {
    icon: FiPhone,
    title: 'Phone Support',
    description: 'Call our support hotline',
    availability: 'Mon-Fri, 8AM-6PM',
    action: '+254 791 250 828',
  },
  {
    icon: FiMail,
    title: 'Email Support',
    description: 'Send us an email',
    availability: 'Response within 24 hours',
    action: 'support@databiz.com',
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Support request submitted successfully! We will get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get help with our services, report issues, or contact our support team
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faq'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Contact Support
          </button>
        </nav>
      </div>

      {activeTab === 'faq' ? (
        <div className="space-y-8">
          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mr-4">
                <FiHelpCircle className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Find answers to common questions</p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    <FiHelpCircle className="text-gray-400 dark:text-gray-500" />
                  </button>
                  <div className="p-4 pt-0">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Support Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportChannels.map((channel, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
                >
                  <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <channel.icon className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {channel.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {channel.description}
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <FiClock className="mr-2" size={14} />
                    {channel.availability}
                  </div>
                  <button className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                    {channel.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Contact Support Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Contact Support
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="service">Service Request</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      required
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      I agree to the terms and conditions
                    </span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Support Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Support Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Support Information
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Response Time</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We aim to respond to all support requests within 24 hours during business days.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Business Hours</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Monday - Friday: 8:00 AM - 6:00 PM</li>
                    <li>• Saturday: 9:00 AM - 1:00 PM</li>
                    <li>• Sunday: Closed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Emergency Support
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For urgent matters outside business hours, call our emergency line:
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">
                    +254 791 250 828
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Before You Contact
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• Check our FAQ section</li>
                    <li>• Have your reference number ready</li>
                    <li>• Describe your issue clearly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
