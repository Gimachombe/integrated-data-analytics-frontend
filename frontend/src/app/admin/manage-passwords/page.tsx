'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiMail, FiUser, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
}

export default function ManagePasswordsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      // Mock data for demo
      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          lastLogin: '2024-01-20',
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          lastLogin: '2024-01-19',
        },
        {
          id: '3',
          email: 'manager@example.com',
          firstName: 'Robert',
          lastName: 'Johnson',
          lastLogin: '2024-01-18',
        },
      ]);
      setFilteredUsers([
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          lastLogin: '2024-01-20',
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          lastLogin: '2024-01-19',
        },
        {
          id: '3',
          email: 'manager@example.com',
          firstName: 'Robert',
          lastName: 'Johnson',
          lastLogin: '2024-01-18',
        },
      ]);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) {
      setError('Please select a user and enter a new password');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/reset-user-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Password reset successfully for ${selectedUser.email}`);
        setNewPassword('');

        // Generate temporary credentials to share with user
        const tempCredentials = {
          email: selectedUser.email,
          password: newPassword,
          note: 'Please change this password after first login',
        };

        console.log('Temporary credentials:', tempCredentials);

        // In real app, you might want to email this to the admin
        // or show it in a secure way
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred while resetting password');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user passwords and handle password reset requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  <FiUsers className="inline mr-2" />
                  Users
                </h2>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <FiUser className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-4">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <FiMail className="mr-2" size={14} />
                          {user.email}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last login: {user.lastLogin}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Password Reset */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                <FiRefreshCw className="inline mr-2" />
                Reset Password
              </h2>

              {selectedUser ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Selected User:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        placeholder="Enter new password"
                      />
                      <button
                        onClick={generateRandomPassword}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Generate
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters with uppercase, lowercase, number, and
                      special character.
                    </p>
                  </div>

                  {message && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
                      {newPassword && (
                        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                          <p className="text-xs font-mono break-all">{newPassword}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Share these credentials securely with the user
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center">
                        <FiAlertCircle className="mr-2 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleResetPassword}
                    disabled={isLoading || !newPassword}
                    className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start">
                      <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Important
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                          • Always share new passwords securely
                          <br />
                          • Inform users to change password after first login
                          <br />• Keep a record of password resets
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FiUser className="mx-auto h-12 w-12 mb-4" />
                  <p>Select a user to reset their password</p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Password Reset Instructions for Users
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>When users forget their passwords:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>They visit the forgot password page</li>
                  <li>Enter their email address</li>
                  <li>System detects it's not an admin account</li>
                  <li>They're instructed to contact you at:</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium">Admin Contact:</p>
                  <p className="text-primary-600 dark:text-primary-400">admin@databizpro.com</p>
                  <p className="text-xs mt-2">Phone: (Optional - add your contact number)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
