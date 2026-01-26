'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiShield,
} from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useAuth();

  const profileStats = [
    { label: 'Total Services', value: '12', color: 'blue' },
    { label: 'Active Requests', value: '3', color: 'green' },
    { label: 'Completed', value: '8', color: 'purple' },
    { label: 'Total Spent', value: 'KES 45,200', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-center">
              <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.email}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'admin'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : user?.role === 'staff'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  <FiShield className="mr-1" size={12} />
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <FiPhone className="text-gray-400 dark:text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">+254 712 345 678</span>
              </div>
              <div className="flex items-center">
                <FiBriefcase className="text-gray-400 dark:text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">Tech Solutions Ltd</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="text-gray-400 dark:text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="text-gray-400 dark:text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">Member since Jan 2023</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {profileStats.map(stat => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    stat.color === 'blue'
                      ? 'text-blue-600 dark:text-blue-400'
                      : stat.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : stat.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {user?.firstName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {user?.lastName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  +254 712 345 678
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  Tech Solutions Ltd
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
                    <FiUser className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Profile Updated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Updated your profile information
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                    <FiMail className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">New Service Request</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Submitted data analysis request
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 mr-3">
                    <FiBriefcase className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Payment Received</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      KES 15,000 payment confirmed
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
