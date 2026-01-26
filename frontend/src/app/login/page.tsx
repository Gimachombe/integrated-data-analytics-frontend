'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the auth context login method
      await login(formData.email, formData.password);

      toast.success('Login successful!');
      // Redirect is handled by AuthContext
    } catch (err: any) {
      console.error('Login error:', err);

      // Handle different error formats
      let errorMessage = 'Login failed. Please try again.';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Test backend connection
  const testBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        toast.success('Backend is connected!');
      } else {
        toast.error('Backend connection failed');
      }
    } catch (error) {
      toast.error('Cannot reach backend');
    }
  };

  // Demo credentials handler
  const useDemoCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@databizpro.com',
        password: 'password123',
      });
    } else {
      setFormData({
        email: 'user@databizpro.com',
        password: 'password123',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access your dashboard and manage your services
          </p>
          <button
            onClick={testBackend}
            className="mt-2 text-xs text-primary-600 hover:text-primary-500"
          >
            Test Backend Connection
          </button>
        </div>

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

          <div className="space-y-4">
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
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot your password?
              </Link>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Create Account
              </Link>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Quick Login Options
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => useDemoCredentials('admin')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Use Admin Demo
              </button>
              <button
                type="button"
                onClick={() => useDemoCredentials('user')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Use User Demo
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Demo Credentials:
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Admin Email:</span>
                  <span className="font-mono">admin@databizpro.com</span>
                </div>
                <div className="flex justify-between">
                  <span>User Email:</span>
                  <span className="font-mono">user@databizpro.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="font-mono">password123</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Note: Create these users first in your database
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
