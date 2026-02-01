import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <FiArrowLeft className="mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
