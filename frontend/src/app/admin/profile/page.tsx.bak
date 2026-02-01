'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiSave,
  FiKey,
  FiCalendar,
  FiShield,
  FiLogOut,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
  role: string;
  user_type: 'admin' | 'user' | 'super_admin';
  created_at: string;
  last_login?: string;
  avatar_url?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileForm {
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getCurrentUser();

      if (response.success && response.data) {
        const userData = response.data;
        setProfile(userData);
        setProfileForm({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          company_name: userData.company_name || '',
        });

        // Cache in localStorage for quick access
        localStorage.setItem('admin_user', JSON.stringify(userData));
      } else {
        throw new Error('Failed to load profile data');
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error(error.message || 'Failed to load profile');

      // Fallback to localStorage if available
      const cachedUser = localStorage.getItem('admin_user');
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        setProfile(user);
        setProfileForm({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          company_name: user.company_name || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!profileForm.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!profileForm.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (profileForm.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(profileForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    setSaving(true);
    try {
      const response = await api.updateProfile(profileForm);

      if (response.success && response.data) {
        setProfile(response.data);
        localStorage.setItem('admin_user', JSON.stringify(response.data));
        setEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setSaving(true);
    try {
      const response = await api.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (response.success) {
        toast.success('Password changed successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
        setErrors({});
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setProfileForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      company_name: profile?.company_name || '',
    });
    setErrors({});
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleSignOutAllDevices = async () => {
    if (!confirm('Are you sure you want to sign out from all devices?')) return;

    try {
      const response = await api.signOutAllDevices();
      if (response.success) {
        toast.success('Signed out from all devices');
      } else {
        throw new Error(response.message || 'Failed to sign out');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out from all devices');
    }
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires additional verification. Please contact support.');
  };

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information, security, and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!editing ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="mt-2 sm:mt-0"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleProfileUpdate} loading={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-blue-600" size={40} />
                      )}
                    </div>
                    <button
                      className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      onClick={() => toast.info('Avatar upload coming soon')}
                    >
                      <FiUser className="text-blue-600" size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile?.first_name} {profile?.last_name}
                    </h3>
                    <p className="text-gray-600">{profile?.role || 'Administrator'}</p>
                    <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>
                  </div>
                </div>

                {/* Profile Form */}
                {editing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={profileForm.first_name}
                        onChange={e =>
                          setProfileForm(prev => ({ ...prev, first_name: e.target.value }))
                        }
                        error={errors.first_name}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={profileForm.last_name}
                        onChange={e =>
                          setProfileForm(prev => ({ ...prev, last_name: e.target.value }))
                        }
                        error={errors.last_name}
                        required
                      />
                    </div>

                    <Input
                      label="Email Address"
                      value={profile?.email || ''}
                      disabled
                      icon={FiMail}
                      helperText="Contact support to change your email"
                    />

                    <Input
                      label="Phone Number"
                      value={profileForm.phone}
                      onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      icon={FiPhone}
                      error={errors.phone}
                      placeholder="+254 700 000 000"
                    />

                    <Input
                      label="Company Name"
                      value={profileForm.company_name}
                      onChange={e =>
                        setProfileForm(prev => ({ ...prev, company_name: e.target.value }))
                      }
                      icon={FiBriefcase}
                      placeholder="Your company name"
                    />
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          First Name
                        </label>
                        <p className="text-gray-900">{profile?.first_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Last Name
                        </label>
                        <p className="text-gray-900">{profile?.last_name}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center text-gray-900">
                        <FiMail className="mr-2 text-gray-400" />
                        {profile?.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center text-gray-900">
                        <FiPhone className="mr-2 text-gray-400" />
                        {profile?.phone || 'Not set'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Company
                      </label>
                      <div className="flex items-center text-gray-900">
                        <FiBriefcase className="mr-2 text-gray-400" />
                        {profile?.company_name || 'Not set'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Account Info & Security */}
          <div className="space-y-6">
            {/* Account Information Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Account Type
                  </label>
                  <div className="flex items-center">
                    <FiShield className="mr-2 text-blue-500" />
                    <span className="text-gray-900 capitalize">
                      {profile?.user_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <p className="text-gray-900">{profile?.role}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Member Since
                  </label>
                  <div className="flex items-center text-gray-900">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {formatDate(profile?.created_at)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                  <div className="flex items-center text-gray-900">
                    <FiLogOut className="mr-2 text-gray-400" />
                    {formatDate(profile?.last_login)}
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>

              {showPasswordForm ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    type="password"
                    label="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={e =>
                      setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))
                    }
                    error={errors.currentPassword}
                    required
                  />

                  <Input
                    type="password"
                    label="New Password"
                    value={passwordForm.newPassword}
                    onChange={e =>
                      setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))
                    }
                    error={errors.newPassword}
                    required
                    helperText="At least 8 characters with uppercase, lowercase, and numbers"
                  />

                  <Input
                    type="password"
                    label="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={e =>
                      setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    error={errors.confirmPassword}
                    required
                  />

                  <div className="flex space-x-2 pt-2">
                    <Button variant="ghost" onClick={handleCancelPassword} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" loading={saving} className="flex-1">
                      Change Password
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordForm(true)}
                    icon={FiKey}
                    className="w-full"
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </Card>

            {/* Account Actions Card */}
            <Card variant="danger">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  onClick={handleSignOutAllDevices}
                  className="w-full justify-start text-blue-600 hover:text-blue-800"
                >
                  Sign out from all devices
                </Button>

                <div className="border-t pt-3">
                  <Button
                    variant="ghost"
                    onClick={handleDeleteAccount}
                    className="w-full justify-start text-red-600 hover:text-red-800"
                  >
                    Delete Account
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Once deleted, your account cannot be recovered. All data will be permanently
                    removed.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
