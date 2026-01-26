'use client';

import Link from 'next/link';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Here are some helpful links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiHome className="mr-2" />
              Dashboard
            </Link>
            <Link
              href="/data-services"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Data Services
            </Link>
            <Link
              href="/business-registration"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Business Registration
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Try searching</h3>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search for services, payments, or documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
            />
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <FiArrowLeft className="mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
