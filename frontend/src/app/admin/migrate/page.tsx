'use client';

import { useState, useEffect } from 'react';
import {
  FiDatabase,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiDownload,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  migratePaymentData,
  checkDataStatus,
  clearAllData,
  restoreFromBackup,
} from '@/scripts/migratePaymentData';

export default function MigrationPage() {
  const [dataStatus, setDataStatus] = useState<any>(null);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDataStatus();
  }, []);

  const loadDataStatus = () => {
    const status = checkDataStatus();
    setDataStatus(status);
    setIsLoading(false);
  };

  const handleMigrate = () => {
    if (confirm('Run data migration? This will update existing data to the new format.')) {
      setIsMigrating(true);
      const result = migratePaymentData();
      setMigrationResult(result);
      loadDataStatus(); // Refresh status
      setIsMigrating(false);
    }
  };

  const handleClearData = () => {
    clearAllData();
  };

  const handleRestoreBackup = () => {
    restoreFromBackup();
  };

  const exportData = () => {
    try {
      const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');

      const exportData = {
        serviceRequests,
        payments,
        exportedAt: new Date().toISOString(),
        totalRequests: serviceRequests.length,
        totalPayments: payments.length,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `service-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiDatabase className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Migration</h1>
          <p className="text-gray-600">Manage and migrate your service request and payment data</p>
        </div>

        {/* Data Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Data Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-4 rounded-lg ${dataStatus?.hasServiceRequests ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className="flex items-center">
                {dataStatus?.hasServiceRequests ? (
                  <FiCheckCircle className="text-green-600 mr-3" size={24} />
                ) : (
                  <FiAlertCircle className="text-gray-600 mr-3" size={24} />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">Service Requests</h3>
                  <p className="text-2xl font-bold mt-1">{dataStatus?.serviceRequestCount}</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${dataStatus?.hasPayments ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className="flex items-center">
                {dataStatus?.hasPayments ? (
                  <FiCheckCircle className="text-green-600 mr-3" size={24} />
                ) : (
                  <FiAlertCircle className="text-gray-600 mr-3" size={24} />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">Payment Records</h3>
                  <p className="text-2xl font-bold mt-1">{dataStatus?.paymentCount}</p>
                </div>
              </div>
            </div>
          </div>

          {dataStatus?.needsMigration && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <FiAlertCircle className="text-yellow-600 mr-3" size={20} />
                <div>
                  <p className="font-medium text-yellow-800">Migration Required</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your data needs to be migrated to the new format for proper payment tracking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Migration Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Migration Actions</h2>

          <div className="space-y-4">
            <button
              onClick={handleMigrate}
              disabled={isMigrating || !dataStatus?.hasServiceRequests}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-colors ${
                isMigrating || !dataStatus?.hasServiceRequests
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isMigrating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Migrating Data...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-3" />
                  Run Data Migration
                </>
              )}
            </button>

            {migrationResult && (
              <div
                className={`p-4 rounded-lg ${migrationResult.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}
              >
                <div className="flex items-start">
                  {migrationResult.errors.length > 0 ? (
                    <FiAlertCircle className="text-yellow-600 mr-3 mt-1" size={20} />
                  ) : (
                    <FiCheckCircle className="text-green-600 mr-3 mt-1" size={20} />
                  )}
                  <div>
                    <p className="font-medium">
                      Migration{' '}
                      {migrationResult.errors.length > 0 ? 'Completed with Issues' : 'Successful'}
                    </p>
                    <div className="text-sm mt-2 space-y-1">
                      <p>Service Requests Migrated: {migrationResult.migratedRequests}</p>
                      <p>Payment Records Created: {migrationResult.migratedPayments}</p>
                      {migrationResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Errors:</p>
                          <ul className="list-disc list-inside text-red-600">
                            {migrationResult.errors
                              .slice(0, 3)
                              .map((error: string, index: number) => (
                                <li key={index} className="text-xs">
                                  {error}
                                </li>
                              ))}
                            {migrationResult.errors.length > 3 && (
                              <li className="text-xs">
                                ... and {migrationResult.errors.length - 3} more errors
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={exportData}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiDownload className="text-blue-600 mb-2" size={24} />
              <span className="font-medium text-gray-900">Export Data</span>
              <span className="text-sm text-gray-600 mt-1">Download JSON backup</span>
            </button>

            <button
              onClick={handleRestoreBackup}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="text-green-600 mb-2" size={24} />
              <span className="font-medium text-gray-900">Restore Backup</span>
              <span className="text-sm text-gray-600 mt-1">Restore from backup</span>
            </button>

            <button
              onClick={handleClearData}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FiTrash2 className="text-red-600 mb-2" size={24} />
              <span className="font-medium text-gray-900">Clear All Data</span>
              <span className="text-sm text-gray-600 mt-1">Remove all data</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Important Notes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Always export data before running migrations</li>
              <li>• Migration cannot be undone once completed</li>
              <li>• Backup data is automatically created before migration</li>
              <li>• Clear data only if you want to start fresh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
