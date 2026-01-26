'use client';

import { useState } from 'react';
import { FaPaperPlane, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  message: string;
  privacyAgreement: boolean;
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'general',
    message: '',
    privacyAgreement: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales Question' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'demo', label: 'Request a Demo' },
    { value: 'custom', label: 'Custom Solution Inquiry' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.message || !formData.privacyAgreement) {
      setErrorMessage('Please fill in all required fields and agree to the privacy policy.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // In a real application, this would be an API call to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful submission
      setStatus('success');

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          inquiryType: 'general',
          message: '',
          privacyAgreement: false,
        });
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FaCheck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-3">Message Sent Successfully!</h3>
        <p className="text-green-700 mb-4">
          Thank you for contacting us. Our team will get back to you within 24 hours.
        </p>
        <p className="text-green-600 text-sm">
          A confirmation email has been sent to {formData.email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Messages */}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <FaExclamationTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Submission Failed</p>
            <p className="text-red-700 text-sm mt-1">
              {errorMessage || 'Please check your connection and try again.'}
            </p>
          </div>
        </div>
      )}

      {errorMessage && status !== 'error' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="John"
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Doe"
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="john@example.com"
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="(555) 123-4567"
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Acme Inc."
          disabled={status === 'submitting'}
        />
      </div>

      {/* Inquiry Type */}
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
          What can we help you with? *
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          disabled={status === 'submitting'}
        >
          {inquiryTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="Tell us about your data analytics needs, questions, or project requirements..."
          disabled={status === 'submitting'}
        />
      </div>

      {/* Privacy Agreement */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id="privacyAgreement"
            name="privacyAgreement"
            checked={formData.privacyAgreement}
            onChange={handleChange}
            required
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={status === 'submitting'}
          />
        </div>
        <div className="ml-3">
          <label htmlFor="privacyAgreement" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </a>{' '}
            and consent to receiving communications from Data Analytics Platform regarding my
            inquiry. *
          </label>
          <p className="text-xs text-gray-500 mt-1">
            We respect your privacy and will never share your information with third parties.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
            status === 'submitting'
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
          }`}
        >
          {status === 'submitting' ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending Message...
            </>
          ) : (
            <>
              <FaPaperPlane className="mr-3" />
              Send Message
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          By submitting this form, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800">
            Terms of Service
          </a>
        </p>
      </div>

      {/* Additional Information */}
      <div className="border-t border-gray-200 pt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Our team reviews your inquiry within 24 hours</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>We'll reach out to schedule a consultation if needed</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>You'll receive relevant resources and next steps</span>
            </li>
          </ul>
        </div>
      </div>
    </form>
  );
}
