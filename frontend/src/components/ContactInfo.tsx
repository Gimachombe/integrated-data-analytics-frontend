import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaGlobe } from 'react-icons/fa';

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Phone Number */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaPhone className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
          <p className="text-gray-600">General Inquiries</p>
          <p className="text-xl font-bold text-gray-900 mt-1">(555) 123-4567</p>
          <p className="text-gray-600 text-sm mt-1">Mon-Fri, 9am-6pm EST</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FaEnvelope className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">Email</h3>
          <p className="text-gray-600">General Support</p>
          <a
            href="mailto:support@dataanalyticsplatform.com"
            className="text-xl font-bold text-blue-600 hover:text-blue-800 mt-1 block"
          >
            support@dataanalyticsplatform.com
          </a>
          <p className="text-gray-600 text-sm mt-1">Sales: sales@dataanalyticsplatform.com</p>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FaMapMarkerAlt className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">Headquarters</h3>
          <p className="text-gray-600">New York Office</p>
          <address className="text-gray-900 not-italic mt-1">
            123 Data Drive
            <br />
            Suite 500
            <br />
            New York, NY 10001
            <br />
            United States
          </address>
          <a
            href="https://maps.google.com/?q=123+Data+Drive+New+York+NY+10001"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
          >
            Get Directions →
          </a>
        </div>
      </div>

      {/* Response Time */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <FaClock className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
          <p className="text-gray-600">Our commitment to you</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Email: Within 24 hours</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Phone: During business hours</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Emergency: 24/7 support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Website */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FaGlobe className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">Website & Resources</h3>
          <div className="mt-2 space-y-2">
            <a href="/docs" className="block text-blue-600 hover:text-blue-800 hover:underline">
              Documentation & Guides
            </a>
            <a href="/api" className="block text-blue-600 hover:text-blue-800 hover:underline">
              API Reference
            </a>
            <a href="/support" className="block text-blue-600 hover:text-blue-800 hover:underline">
              Support Center
            </a>
            <a href="/blog" className="block text-blue-600 hover:text-blue-800 hover:underline">
              Blog & Insights
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
