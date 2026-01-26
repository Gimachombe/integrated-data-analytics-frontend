'use client';

import { useState } from 'react';
import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiUpload,
  FiUser,
  FiMapPin,
  FiMail,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BusinessRegistrationPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'track'>('new');
  const [registrationType, setRegistrationType] = useState<'name_search' | 'incorporation'>(
    'name_search'
  );
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownershipType: '',
    owners: [{ name: '', idNumber: '', sharePercentage: 100 }],
    address: '',
    city: '',
    postalCode: '',
    email: '',
    phone: '',
  });

  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.success('Business registration request submitted successfully');
      // Reset form
      setFormData({
        businessName: '',
        businessType: '',
        ownershipType: '',
        owners: [{ name: '', idNumber: '', sharePercentage: 100 }],
        address: '',
        city: '',
        postalCode: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Tracking business registration: ${trackingNumber}`);
  };

  const addOwner = () => {
    setFormData({
      ...formData,
      owners: [...formData.owners, { name: '', idNumber: '', sharePercentage: 0 }],
    });
  };

  const removeOwner = (index: number) => {
    if (formData.owners.length > 1) {
      const newOwners = [...formData.owners];
      newOwners.splice(index, 1);
      setFormData({ ...formData, owners: newOwners });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Registration</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Register your business name or incorporate a company with full compliance support
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('new')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'new'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            New Registration
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'track'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Track Application
          </button>
        </nav>
      </div>

      {activeTab === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Registration Details
              </h3>

              {/* Registration Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Registration Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationType('name_search')}
                    className={`p-4 border rounded-lg text-left ${
                      registrationType === 'name_search'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          registrationType === 'name_search'
                            ? 'bg-primary-100 dark:bg-primary-800'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <FiHome
                          className={
                            registrationType === 'name_search'
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Business Name Search & Registration
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">KES 2,500</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistrationType('incorporation')}
                    className={`p-4 border rounded-lg text-left ${
                      registrationType === 'incorporation'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          registrationType === 'incorporation'
                            ? 'bg-primary-100 dark:bg-primary-800'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <FiHome
                          className={
                            registrationType === 'incorporation'
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Company Incorporation
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">KES 15,000</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="sole_proprietor">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="ltd">Private Limited Company</option>
                      <option value="plc">Public Limited Company</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Owners */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Owners/Directors
                    </label>
                    <button
                      type="button"
                      onClick={addOwner}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      + Add Owner
                    </button>
                  </div>
                  {formData.owners.map((owner, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={owner.name}
                          onChange={e => {
                            const newOwners = [...formData.owners];
                            newOwners[index].name = e.target.value;
                            setFormData({ ...formData, owners: newOwners });
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="ID Number"
                          value={owner.idNumber}
                          onChange={e => {
                            const newOwners = [...formData.owners];
                            newOwners[index].idNumber = e.target.value;
                            setFormData({ ...formData, owners: newOwners });
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="number"
                          placeholder="Share %"
                          value={owner.sharePercentage}
                          onChange={e => {
                            const newOwners = [...formData.owners];
                            newOwners[index].sharePercentage = Number(e.target.value);
                            setFormData({ ...formData, owners: newOwners });
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        {formData.owners.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOwner(index)}
                            className="px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Physical Address *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Required Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop or{' '}
                      <button
                        type="button"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        browse
                      </button>{' '}
                      to upload
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID copies, passport photos, business plan (PDF, JPG, PNG up to 10MB)
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Submit Registration Request - KES{' '}
                    {registrationType === 'name_search' ? '2,500' : '15,000'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Process Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Registration Process
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        1
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Submit Application
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Complete the registration form with all required details
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        2
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Document Verification
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Our team reviews your documents for compliance
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        3
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Submission to relevant government authorities
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        4
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Completion</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Receive your registration certificates
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300">Estimated Timeline</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {registrationType === 'name_search' ? '5-7 business days' : '10-15 business days'}
                </p>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-300">What You Get</h4>
                <ul className="text-sm text-green-600 dark:text-green-400 mt-2 space-y-1">
                  <li>• Business Name Certificate</li>
                  <li>• PIN Certificate</li>
                  <li>• Compliance Documents</li>
                  <li>• Digital Copies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Track Application */
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Track Your Application
          </h3>
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number (e.g., BR-20240001)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Track Application
            </button>
          </form>

          {/* Sample Tracking Info */}
          {trackingNumber && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Application Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <FiCheckCircle className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Application Submitted
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2024-01-10</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <FiCheckCircle className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">Document Review</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2024-01-12</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FiClock className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">Processing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
