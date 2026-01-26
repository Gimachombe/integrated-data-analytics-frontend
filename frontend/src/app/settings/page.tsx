'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiUser,
  FiBell,
  FiLock,
  FiGlobe,
  FiCreditCard,
  FiShield,
  FiSave,
  FiEye,
  FiEyeOff,
  FiLoader,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '@/services/api';

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  kraPin: string;
  address: string;
  role: string;
  createdAt: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  paymentAlerts: boolean;
  serviceUpdates: boolean;
  marketingEmails: boolean;
}

interface BillingInfo {
  plan: string;
  amount: number;
  status: string;
  paymentMethods: Array<{
    id: string;
    type: string;
    last4: string;
    expiry: string;
  }>;
  billingHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
  }>;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>(
    'profile'
  );
  const [isLoading, setIsLoading] = useState({
    profile: false,
    security: false,
    notifications: false,
    billing: false,
    fetch: true,
  });

  const [profileData, setProfileData] = useState<UserProfile>({
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    kraPin: '',
    address: '',
    role: 'client',
    createdAt: '',
  });

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    serviceUpdates: true,
    marketingEmails: false,
  });

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: 'Business Plan',
    amount: 15000,
    status: 'Active',
    paymentMethods: [{ id: '1', type: 'visa', last4: '4242', expiry: '12/25' }],
    billingHistory: [{ id: '1', date: '2024-01-15', amount: 15000, status: 'Paid' }],
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user profile data from backend
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchNotificationSettings();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(prev => ({ ...prev, fetch: true }));
      const response = await api.get('/users/profile');

      if (response) {
        setProfileData({
          id: response.id || 0,
          email: response.email || '',
          firstName: response.firstName || response.first_name || '',
          lastName: response.lastName || response.last_name || '',
          phone: response.phone || '',
          companyName: response.companyName || response.company_name || '',
          kraPin: response.kraPin || response.kra_pin || '',
          address: response.address || '',
          role: response.role || 'client',
          createdAt: response.createdAt || response.created_at || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile data');

      // Fallback to current user data from auth context
      if (user) {
        setProfileData(prev => ({
          ...prev,
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          companyName: user.companyName || '',
        }));
      }
    } finally {
      setIsLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      // This endpoint would need to be created in backend
      const response = await api.get('/users/notification-settings');
      if (response) {
        setNotificationSettings({
          emailNotifications: response.emailNotifications !== false,
          smsNotifications: response.smsNotifications || false,
          paymentAlerts: response.paymentAlerts !== false,
          serviceUpdates: response.serviceUpdates !== false,
          marketingEmails: response.marketingEmails || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      // Use default settings if API fails
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, profile: true }));

    try {
      // Prepare data for backend
      const profileUpdateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        companyName: profileData.companyName,
        kraPin: profileData.kraPin,
        address: profileData.address,
      };

      // Send update to backend
      const response = await api.put('/users/profile', profileUpdateData);

      toast.success('Profile updated successfully');

      // Update local user data if needed
      if (response.user) {
        // You might want to update the auth context here
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!securityData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (securityData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(prev => ({ ...prev, security: true }));

    try {
      // Send password change request to backend
      const response = await api.post('/auth/change-password', {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });

      toast.success('Password changed successfully');

      // Reset form
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: securityData.twoFactorEnabled,
      });

      // Clear password visibility
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      console.error('Password change error:', error);
      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(prev => ({ ...prev, security: false }));
    }
  };

  const handleNotificationsSubmit = async () => {
    setIsLoading(prev => ({ ...prev, notifications: true }));

    try {
      // Send notification settings to backend
      await api.put('/users/notification-settings', notificationSettings);

      toast.success('Notification preferences saved');
    } catch (error: any) {
      console.error('Notification settings error:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setIsLoading(prev => ({ ...prev, notifications: false }));
    }
  };

  const toggleTwoFactorAuth = async () => {
    const newValue = !securityData.twoFactorEnabled;

    try {
      // Send 2FA toggle request to backend
      await api.post('/users/two-factor', { enabled: newValue });

      setSecurityData(prev => ({ ...prev, twoFactorEnabled: newValue }));

      toast.success(`Two-factor authentication ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      console.error('2FA toggle error:', error);
      toast.error('Failed to update two-factor authentication');
    }
  };

  if (isLoading.fetch) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <nav className="space-y-1 p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiUser size={20} />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiLock size={20} />
                <span className="font-medium">Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiBell size={20} />
                <span className="font-medium">Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  activeTab === 'billing'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiCreditCard size={20} />
                <span className="font-medium">Billing</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mr-4">
                  <FiUser className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Update your personal and company details
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      KRA PIN
                    </label>
                    <input
                      type="text"
                      value={profileData.kraPin}
                      onChange={e => setProfileData({ ...profileData, kraPin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={e => setProfileData({ ...profileData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date(profileData.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading.profile}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading.profile ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
                  <FiShield className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Security Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your password and security preferences
                  </p>
                </div>
              </div>

              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={securityData.currentPassword}
                      onChange={e =>
                        setSecurityData({ ...securityData, currentPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={securityData.newPassword}
                        onChange={e =>
                          setSecurityData({ ...securityData, newPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 6 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={securityData.confirmPassword}
                        onChange={e =>
                          setSecurityData({ ...securityData, confirmPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTwoFactorAuth}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securityData.twoFactorEnabled
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading.security}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading.security ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Security Settings'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                  <FiBell className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notification Preferences
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose how you want to be notified
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: !notificationSettings.emailNotifications,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.emailNotifications
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: !notificationSettings.smsNotifications,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.smsNotifications
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Payment Alerts</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notify me about payment activities
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        paymentAlerts: !notificationSettings.paymentAlerts,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.paymentAlerts
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Service Updates</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notify me about service status changes
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        serviceUpdates: !notificationSettings.serviceUpdates,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.serviceUpdates
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationSettings.serviceUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleNotificationsSubmit}
                    disabled={isLoading.notifications}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading.notifications ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Preferences
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                  <FiCreditCard className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Billing & Subscription
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your billing information and subscription
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {billingInfo.plan}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        KES {billingInfo.amount.toLocaleString()}/month
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        billingInfo.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {billingInfo.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Includes:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Up to 5 data service requests per month</li>
                      <li>• Unlimited business registrations</li>
                      <li>• Priority support</li>
                      <li>• Advanced analytics reports</li>
                    </ul>
                  </div>
                  <button className="mt-6 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Change Plan
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Payment Methods
                  </h4>
                  <div className="space-y-4">
                    {billingInfo.paymentMethods.map(method => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                            <FiCreditCard className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in{' '}
                              {method.last4}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Expires {method.expiry}
                            </p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors">
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      + Add Payment Method
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Billing History
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Invoice
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {billingInfo.billingHistory.map(invoice => (
                          <tr key={invoice.id}>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {invoice.date}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              KES {invoice.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  invoice.status === 'Paid'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                              >
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm transition-colors">
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
