/**
 * Payment Data Migration Script
 *
 * This script migrates existing service request data to include proper payment information.
 * Run this script once to update existing data in localStorage.
 *
 * Usage:
 * 1. Save this file to frontend/src/scripts/migratePaymentData.ts
 * 2. Run in browser console or create a migration page
 */

interface OldServiceRequest {
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: any[];
  totalAmount: number;
  totalWithFees?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReference?: string;
  paymentDate?: string;
  status: string;
  submittedAt: string;
  [key: string]: any;
}

interface NewServiceRequest {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: any[];
  totalAmount: number;
  totalWithFees: number;
  paymentMethod: 'mpesa' | 'bank' | 'card' | 'cash' | null;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentReference: string;
  paymentDate: string;
  status: 'pending_payment' | 'paid_pending_processing' | 'processing' | 'completed' | 'cancelled';
  submittedAt: string;
  paymentDetails?: any;
  paymentData?: any;
}

interface PaymentRecord {
  id: string;
  paymentReference: string;
  serviceReference: string;
  amount: number;
  totalWithFees: number;
  currency: string;
  paymentMethod: 'mpesa' | 'bank' | 'card' | 'cash';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  completedAt?: string;
  serviceType?: string;
  priority?: string;
  services?: any[];
  paymentData?: any;
}

export const migratePaymentData = (): {
  migratedRequests: number;
  migratedPayments: number;
  errors: string[];
} => {
  const errors: string[] = [];
  let migratedRequests = 0;
  let migratedPayments = 0;

  try {
    console.log('Starting payment data migration...');

    // Load existing service requests
    const savedRequests = localStorage.getItem('serviceRequests');
    if (!savedRequests) {
      console.log('No service requests found in localStorage');
      return { migratedRequests: 0, migratedPayments: 0, errors: ['No data found'] };
    }

    const oldRequests: OldServiceRequest[] = JSON.parse(savedRequests);
    console.log(`Found ${oldRequests.length} service requests to migrate`);

    // Create new service requests array
    const newServiceRequests: NewServiceRequest[] = [];
    const paymentRecords: PaymentRecord[] = [];

    oldRequests.forEach((oldRequest, index) => {
      try {
        // Generate a unique ID if not present
        const requestId = oldRequest.id || `req-migrated-${Date.now()}-${index}`;

        // Determine payment status from existing data
        let paymentStatus: PaymentRecord['paymentStatus'] = 'pending';
        let paymentMethod: PaymentRecord['paymentMethod'] = 'cash';
        let paymentReference = oldRequest.paymentReference;

        if (oldRequest.status === 'paid_pending_processing' || oldRequest.status === 'completed') {
          paymentStatus = 'completed';
          paymentMethod = (oldRequest.paymentMethod as PaymentRecord['paymentMethod']) || 'cash';

          // Generate payment reference if missing
          if (!paymentReference) {
            paymentReference = `PAY-MIGRATED-${Date.now()}-${index}`;
          }
        } else if (oldRequest.status === 'cancelled') {
          paymentStatus = 'failed';
        }

        // Calculate total with fees if missing
        const totalWithFees = oldRequest.totalWithFees || oldRequest.totalAmount || 0;

        // Create new service request
        const newRequest: NewServiceRequest = {
          id: requestId,
          referenceNumber: oldRequest.referenceNumber || `SR-MIGRATED-${index}`,
          firstName: oldRequest.firstName || 'Unknown',
          lastName: oldRequest.lastName || 'Customer',
          email: oldRequest.email || '',
          phone: oldRequest.phone || '',
          services: oldRequest.services || [],
          totalAmount: oldRequest.totalAmount || 0,
          totalWithFees,
          paymentMethod: (oldRequest.paymentMethod as any) || null,
          paymentStatus: paymentStatus,
          paymentReference: paymentReference,
          paymentDate: oldRequest.paymentDate || oldRequest.submittedAt || new Date().toISOString(),
          status: (oldRequest.status as NewServiceRequest['status']) || 'pending_payment',
          submittedAt: oldRequest.submittedAt || new Date().toISOString(),
          paymentDetails: oldRequest.paymentDetails || oldRequest.paymentData,
          paymentData: oldRequest.paymentData,
        };

        newServiceRequests.push(newRequest);
        migratedRequests++;

        // Create payment record if payment was made
        if (paymentStatus === 'completed' && paymentReference) {
          const paymentRecord: PaymentRecord = {
            id: `payment-migrated-${Date.now()}-${index}`,
            paymentReference: paymentReference,
            serviceReference: newRequest.referenceNumber,
            amount: newRequest.totalAmount,
            totalWithFees: newRequest.totalWithFees,
            currency: 'KES',
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            transactionId:
              oldRequest.paymentDetails?.transactionId ||
              oldRequest.paymentData?.transactionId ||
              `TXN-MIGRATED-${Date.now()}-${index}`,
            customerName: `${newRequest.firstName} ${newRequest.lastName}`,
            customerEmail: newRequest.email,
            customerPhone: newRequest.phone,
            createdAt: newRequest.paymentDate,
            completedAt: newRequest.paymentDate,
            serviceType: oldRequest.serviceType,
            priority: oldRequest.priority,
            services: newRequest.services,
            paymentData: newRequest.paymentData,
          };

          paymentRecords.push(paymentRecord);
          migratedPayments++;
        }
      } catch (error) {
        const errorMsg = `Error migrating request ${index}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    });

    // Save migrated data back to localStorage
    localStorage.setItem('serviceRequests', JSON.stringify(newServiceRequests));
    console.log(`Saved ${newServiceRequests.length} migrated service requests`);

    // Load existing payments and merge with migrated ones
    const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const allPayments = [...existingPayments, ...paymentRecords];
    localStorage.setItem('payments', JSON.stringify(allPayments));
    console.log(
      `Saved ${allPayments.length} total payment records (${paymentRecords.length} migrated)`
    );

    // Also save a backup of old data
    localStorage.setItem('serviceRequests_backup_' + new Date().toISOString(), savedRequests);
    console.log('Created backup of original data');

    console.log('Migration completed successfully!');
    console.log(`- Migrated ${migratedRequests} service requests`);
    console.log(`- Created ${migratedPayments} payment records`);
    if (errors.length > 0) {
      console.log(`- ${errors.length} errors occurred`);
    }

    return {
      migratedRequests,
      migratedPayments,
      errors,
    };
  } catch (error) {
    const errorMsg = `Migration failed: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMsg);
    errors.push(errorMsg);

    return {
      migratedRequests: 0,
      migratedPayments: 0,
      errors,
    };
  }
};

// Export utility functions
export const checkDataStatus = (): {
  hasServiceRequests: boolean;
  hasPayments: boolean;
  serviceRequestCount: number;
  paymentCount: number;
  needsMigration: boolean;
} => {
  try {
    const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');

    const hasServiceRequests = serviceRequests.length > 0;
    const hasPayments = payments.length > 0;

    // Check if migration is needed (look for old format)
    let needsMigration = false;
    if (hasServiceRequests) {
      const sampleRequest = serviceRequests[0];
      needsMigration = !sampleRequest.id || !sampleRequest.paymentReference;
    }

    return {
      hasServiceRequests,
      hasPayments,
      serviceRequestCount: serviceRequests.length,
      paymentCount: payments.length,
      needsMigration,
    };
  } catch (error) {
    console.error('Error checking data status:', error);
    return {
      hasServiceRequests: false,
      hasPayments: false,
      serviceRequestCount: 0,
      paymentCount: 0,
      needsMigration: false,
    };
  }
};

export const clearAllData = (): void => {
  if (
    confirm('Are you sure you want to clear ALL service and payment data? This cannot be undone.')
  ) {
    localStorage.removeItem('serviceRequests');
    localStorage.removeItem('payments');
    localStorage.removeItem('serviceRequestForPayment');
    localStorage.removeItem('pendingServiceRequest');
    localStorage.removeItem('selectedKRAServices');

    // Remove backup data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('serviceRequests_backup_')) {
        localStorage.removeItem(key);
      }
    });

    console.log('All service and payment data cleared');
    alert('All data has been cleared. Page will reload.');
    window.location.reload();
  }
};

export const restoreFromBackup = (): boolean => {
  try {
    // Find the most recent backup
    const backupKeys = Object.keys(localStorage).filter(key =>
      key.startsWith('serviceRequests_backup_')
    );

    if (backupKeys.length === 0) {
      alert('No backup data found');
      return false;
    }

    // Sort by timestamp (newest first)
    backupKeys.sort((a, b) => b.localeCompare(a));
    const latestBackupKey = backupKeys[0];

    const backupData = localStorage.getItem(latestBackupKey);
    if (!backupData) {
      alert('Backup data is empty');
      return false;
    }

    if (
      confirm(`Restore data from backup: ${latestBackupKey}? This will overwrite current data.`)
    ) {
      localStorage.setItem('serviceRequests', backupData);
      console.log('Data restored from backup:', latestBackupKey);
      alert('Data restored successfully! Page will reload.');
      window.location.reload();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    alert('Failed to restore backup');
    return false;
  }
};

// Auto-run check on import
console.log('Payment Data Migration Script loaded');
console.log('Available functions:');
console.log('- migratePaymentData(): Run migration');
console.log('- checkDataStatus(): Check current data status');
console.log('- clearAllData(): Clear all data');
console.log('- restoreFromBackup(): Restore from backup');
