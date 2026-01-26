'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: FiMapPin,
    title: 'Visit Our Office',
    details: ['Nairobi CBD, Upper Hill', 'P.O. Box 12345-00100', 'Nairobi, Kenya'],
    color: 'blue',
  },
  {
    icon: FiPhone,
    title: 'Call Us',
    details: ['+254 700 000 000', '+254 711 000 000', 'Mon-Fri: 8:00 AM - 6:00 PM'],
    color: 'green',
  },
  {
    icon: FiMail,
    title: 'Email Us',
    details: ['info@databizpro.com', 'support@databizpro.com', 'sales@databizpro.com'],
    color: 'purple',
  },
  {
    icon: FiClock,
    title: 'Business Hours',
    details: ['Monday - Friday: 8AM - 6PM', 'Saturday: 9AM - 1PM', 'Sunday: Closed'],
    color: 'orange',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you within 24 hours.');
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Get in touch with our team. We're here to help you with any questions about our services.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
          >
            <div
              className={`p-3 rounded-full ${info.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' : info.color === 'green' ? 'bg-green-100 dark:bg-green-900' : info.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-orange-100 dark:bg-orange-900'} w-14 h-14 flex items-center justify-center mx-auto mb-4`}
            >
              <info.icon
                className={`${info.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : info.color === 'green' ? 'text-green-600 dark:text-green-400' : info.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-orange-600 dark:text-orange-400'}`}
                size={24}
              />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
              {info.title}
            </h3>
            <div className="space-y-1">
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 dark:text-gray-400 text-sm">
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Send us a Message
          </h2>

          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for contacting us. We will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="services">Services Information</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Business Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
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
                    I agree to the terms and privacy policy
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Response Time
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our team typically responds within 2-4 hours during business hours. For urgent
                matters, please call our support line directly.
              </p>
            </div>
          </div>
        </div>

        {/* Map and Additional Info */}
        <div className="space-y-8">
          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Our Location
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visit us at our headquarters in Nairobi CBD
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              {/* Simulated Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                      <FiMapPin className="text-white" size={24} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">
                    Nairobi CBD, Upper Hill
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    Interactive map will be integrated here
                  </p>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">+</span>
                </button>
                <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">-</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get directions to our office
                </p>
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Open in Maps
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What are your business hours?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Our offices are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays
                  from 9:00 AM to 1:00 PM. We're closed on Sundays and public holidays.
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How quickly will I get a response?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We typically respond to emails within 2-4 hours during business hours. For urgent
                  matters, we recommend calling our support line.
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer remote consultations?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes, we offer virtual consultations via Zoom, Google Meet, or Microsoft Teams.
                  Schedule a meeting through our contact form.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What information should I include in my inquiry?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Please include your name, company, contact details, and a detailed description of
                  your needs to help us provide the best assistance.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">Note:</span> For technical support requests,
                  please have your account details or ticket number ready for faster assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Connect With Us
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: 'Twitter',
                  color: 'bg-blue-100 dark:bg-blue-900',
                  text: 'text-blue-600 dark:text-blue-400',
                },
                {
                  name: 'LinkedIn',
                  color: 'bg-blue-50 dark:bg-blue-900/20',
                  text: 'text-blue-700 dark:text-blue-300',
                },
                {
                  name: 'Facebook',
                  color: 'bg-blue-100 dark:bg-blue-900',
                  text: 'text-blue-600 dark:text-blue-400',
                },
                {
                  name: 'Instagram',
                  color: 'bg-pink-100 dark:bg-pink-900',
                  text: 'text-pink-600 dark:text-pink-400',
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${social.color} rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}
                >
                  <p className={`font-semibold ${social.text}`}>{social.name}</p>
                </a>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Follow us for updates, tips, and industry insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Get the latest insights, tips, and updates about data analytics directly in your inbox.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-primary-200 mt-3">No spam. Unsubscribe at any time.</p>
        </div>
      </div>
    </div>
  );
}
                     