'use client';

import { FiUsers, FiTarget, FiAward, FiGlobe, FiShield, FiHeart } from 'react-icons/fi';

const teamMembers = [
  {
    name: 'Julius Chacha',
    role: 'CEO & Founder',
    bio: '10+ years in data analytics and business consultancy',
    image: 'JC',
  },
  {
    name: 'Jacob Gimachombe',
    role: 'Head of Operations',
    bio: 'Ecitizen compliance officer with 8 years experience',
    image: 'JG',
  },
  {
    name: 'David Ochieng',
    role: 'Lead Data Scientist',
    bio: 'PhD in Data Science with 12 years industry experience',
    image: 'DO',
  },
  {
    name: 'Grace Wanjiku',
    role: 'Legal & Compliance Director',
    bio: 'Corporate lawyer specializing in business registration',
    image: 'GW',
  },
];

const values = [
  {
    icon: FiShield,
    title: 'Integrity',
    description:
      'We maintain the highest standards of honesty and transparency in all our dealings.',
  },
  {
    icon: FiTarget,
    title: 'Excellence',
    description:
      'We strive for excellence in every service we provide, ensuring quality and precision.',
  },
  {
    icon: FiUsers,
    title: 'Collaboration',
    description:
      'We work closely with our clients to understand their unique needs and challenges.',
  },
  {
    icon: FiHeart,
    title: 'Customer Focus',
    description:
      'Our clients success is our success. We go above and beyond to ensure satisfaction.',
  },
  {
    icon: FiGlobe,
    title: 'Innovation',
    description:
      'We continuously adopt new technologies and methodologies to deliver better results.',
  },
  {
    icon: FiAward,
    title: 'Reliability',
    description: 'You can count on us to deliver on our promises, every time.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          About Mensch Tech Consultancy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Empowering businesses with comprehensive data analytics and compliance solutions.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FiTarget className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            To simplify complex business processes through innovative technology, providing
            businesses with the tools they need to make data-driven decisions and stay compliant
            with regulations. We aim to be the trusted partner that businesses rely on for their
            data and compliance needs.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <FiGlobe className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            To become Africa's leading platform for integrated business services, transforming how
            businesses operate by making data analytics and compliance accessible, affordable, and
            efficient for businesses of all sizes across the continent.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Mensch Tech Consultancy began as a small consultancy firm helping local businesses
              with data analysis and compliance requirements. Our founders, experienced
              professionals from both the tech and business sectors, recognized a significant gap in
              the market.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Many businesses struggled with fragmented service providers for their data needs and
              regulatory compliance. There was no single platform that could handle everything from
              data mining to KRA compliance.
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              What started as a simple idea has grown into a comprehensive platform serving over 500
              businesses across Kenya. We've helped register more than 300 companies, processed over
              50,000 data operations, and achieved a 98% client satisfaction rate.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Today, we continue to innovate and expand our services, always keeping our core values
              at the heart of everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 w-14 h-14 flex items-center justify-center mb-4">
                <value.icon className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Meet Our Leadership Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map(member => (
            <div
              key={member.name}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
            >
              <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {member.image}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                {member.name}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-primary-100">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">1200+</div>
            <div className="text-primary-100">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">300+</div>
            <div className="text-primary-100">Businesses Registered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-primary-100">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Work With Us?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join hundreds of businesses that trust us with their data and compliance needs. Let's
          build something amazing together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  );
}
