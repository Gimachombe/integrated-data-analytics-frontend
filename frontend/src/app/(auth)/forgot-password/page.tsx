'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiAlertCircle, FiUsers, FiMessageSquare } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if email is admin email
  const checkEmailType = (email: string) => {
    const adminEmails = [
      'admin@databizpro.com',
      'administrator@databizpro.com',
      'system.admin@databizpro.com',
    ];
    return adminEmails.includes(email.toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsAdmin(checkEmailType(newEmail));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isAdmin) {
        // Admin reset - send reset link
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          // Auto-redirect after 5 seconds
          setTimeout(() => {
            router.push('/login');
          }, 5000);
        } else {
          setError(data.error || 'Failed to send reset link');
        }
      } else {
        // Regular user - show contact admin message
        setSuccess(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <div
            className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${isAdmin ? 'bg-primary-600' : 'bg-yellow-500'}`}
          >
            {isAdmin ? (
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            ) : (
              <FiUsers className="h-8 w-8 text-white" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isAdmin
              ? 'Enter your admin email to receive a reset link'
              : 'Enter your email to see reset options'}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div
              className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isAdmin ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}
            >
              {isAdmin ? (
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <FiMessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isAdmin ? 'Check Your Email' : 'Contact Administrator'}
              </h3>

              {isAdmin ? (
                <>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    We've sent a password reset link to{' '}
                    <span className="font-semibold">{email}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    The link will expire in 1 hour
                  </p>
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Redirecting to login in 5 seconds...
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Regular users cannot reset passwords directly.
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Please contact the system administrator at:
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <FiMail className="text-gray-500" />
                        <a
                          href="mailto:admin@databizpro.com"
                          className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                        >
                          admin@databizpro.com
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Include your registered email and request for password reset.
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    The administrator will assist you with password recovery.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm">
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to login
                </Link>
              </div>

              {isAdmin && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start">
                    <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      <span className="font-semibold">Development Note:</span> Check your backend
                      console for the reset link.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <FiAlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email address
              </label>
              <div className="relative">
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
                  onChange={handleEmailChange}
                  className="pl-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>

              {/* Email Type Indicator */}
              {email && (
                <div
                  className={`mt-2 p-2 rounded-lg text-sm ${isAdmin ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="flex items-center">
                    {isAdmin ? (
                      <>
                        <svg
                          className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <span>Admin account detected. You can reset your password directly.</span>
                      </>
                    ) : (
                      <>
                        <FiUsers className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Regular user account. You'll need to contact the administrator.</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
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
                    {isAdmin ? 'Sending reset link...' : 'Checking account...'}
                  </span>
                ) : isAdmin ? (
                  'Send Reset Link'
                ) : (
                  'Continue'
                )}
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="text-sm">
                <Link
                  href="/admin/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        )}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Data Business Solutions Ltd.</p>
        </div>
      </div>
    </div>
  );
}
