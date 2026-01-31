import Link from 'next/link';
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Our Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const services = [
    { name: 'Data Analytics', href: '/services/data' },
    { name: 'Business Services', href: '/services/business' },
    { name: 'KRA Services', href: '/services/kra' },
    { name: 'Bookkeeping', href: '/services/bookkeeping' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com' },
  ];

  const contactInfo = [
    { icon: FiMail, text: 'info@menschtech.com', href: 'mailto:info@menschtech.com' },
    { icon: FiPhone, text: '+254 700 000 000', href: 'tel:+254791250828' },
    { icon: FiGlobe, text: 'www.menschtech.com', href: 'https://menschtech.com' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">DB</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">MENSCH TECH CONSULTANCY</h3>
                <p className="text-sm text-gray-400">Analytics & Business Services</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner for data analytics, business registration, and professional
              services in Kenya.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map(service => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                    <contact.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  {contact.href.startsWith('http') ||
                  contact.href.startsWith('mailto') ||
                  contact.href.startsWith('tel') ? (
                    <a
                      href={contact.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="text-gray-400">{contact.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} MENSCH TECH CONSULTANCY. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
