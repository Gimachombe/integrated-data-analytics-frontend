module.exports = {
  // Payment Constants
  PAYMENT_METHODS: {
    MPESA: 'mpesa',
    CARD: 'card',
    BANK_TRANSFER: 'bank_transfer',
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // Service Constants
  SERVICE_TYPES: {
    DATA_MINING: 'data_mining',
    DATA_CLEANING: 'data_cleaning',
    DATA_COLLECTION: 'data_collection',
    DATA_ANALYSIS: 'data_analysis',
    BUSINESS_REGISTRATION: 'business_registration',
    COMPANY_MAINTENANCE: 'company_maintenance',
    KRA_SERVICES: 'kra_services',
    BOOKKEEPING: 'bookkeeping',
    AUDIT: 'audit',
  },

  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    STAFF: 'staff',
    CLIENT: 'client',
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    SERVICE_REQUEST: 'service_request',
    SERVICE_UPDATE: 'service_update',
    SYSTEM_ALERT: 'system_alert',
  },
};
