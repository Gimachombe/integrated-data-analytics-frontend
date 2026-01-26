'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call backend API to request password reset
      await api.post('/auth/forgot-password', { email });

      setIsSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (err: any) {
      console.error('Forgot password error:', err);

      let errorMessage = 'Failed to send reset link. Please try again.';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to login
          </Link>

          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Check your email
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox
              and follow the instructions to reset your password.
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Try another email
              </button>
              <br />
              <Link
                href="/login"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                <FiArrowLeft className="mr-2" />
                Return to login
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> In development mode, the reset link will be logged in the backend
            console. In production, this would send an actual email.
          </p>
        </div>
      </div>
    </div>
  );
}
