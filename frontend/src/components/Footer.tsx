import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">DataBiz</h3>
            <p className="mb-4">
              Your one-stop digital solution for data analytics and business services. Professional,
              secure, and scalable solutions for businesses of all sizes.
            </p>
            <div className="flex space-x-4">
              <a href="#faceboo.com" className="hover:text-white">
                <FiFacebook size={20} />
              </a>
              <a href="X.com" className="hover:text-white">
                <FiTwitter size={20} />
              </a>
              <a href="linkedin.con" className="hover:text-white">
                <FiLinkedin size={20} />
              </a>
              <a href="instagram.com" className="hover:text-white">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/data-services" className="hover:text-white">
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link href="/business-registration" className="hover:text-white">
                  Business Registration
                </Link>
              </li>
              <li>
                <Link href="/kra-services" className="hover:text-white">
                  KRA Services
                </Link>
              </li>
              <li>
                <Link href="/bookkeeping" className="hover:text-white">
                  Bookkeeping
                </Link>
              </li>
              <li>
                <Link href="/company-maintenance" className="hover:text-white">
                  Company Maintenance
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="hover:text-white">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} DataBiz. All rights reserved. Registered in Kenya.
            Company Number: ABC123456.
          </p>
          <p className="text-sm mt-2">
            Need help? Email us at{' '}
            <a
              href="mailto:support@databizpro.com"
              className="text-primary-400 hover:text-primary-300"
            >
              support@databizpro.com
            </a>{' '}
            or call{' '}
            <a href="tel:+254700000000" className="text-primary-400 hover:text-primary-300">
              +254 791 250 828
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
