// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'staff' | 'client';
  phone?: string;
  companyName?: string;
  kraPin?: string;
  createdAt?: string;
  isActive?: boolean;
}

// Service Types
export interface DataServiceRequest {
  id?: number;
  userId: string;
  serviceType: 'mining' | 'cleaning' | 'collection' | 'analysis';
  dataSource?: string;
  requirements: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  reportUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface BusinessRegistration {
  id?: number;
  userId: string;
  businessName: string;
  registrationType: 'name_search' | 'incorporation';
  documents?: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  trackingNumber?: string;
  estimatedCompletion?: string;
  createdAt: string;
}

export interface KRAService {
  id?: number;
  userId: string;
  serviceType: 'pin_registration' | 'tax_filing' | 'compliance';
  taxType?: string;
  period?: string;
  documents?: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  kraReference?: string;
  createdAt: string;
}

export interface BookkeepingService {
  id?: number;
  userId: string;
  serviceType: 'bookkeeping' | 'audit_prep';
  financialPeriod: string;
  documents?: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'review';
  assignedAccountant?: string;
  completedAt?: string;
  createdAt: string;
}

// Payment Types
export interface Payment {
  id?: number;
  userId: string;
  serviceId?: number;
  serviceType?: string;
  amount: number;
  currency?: string;
  paymentMethod: 'mpesa' | 'card' | 'bank_transfer';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  serviceId?: string;
  serviceType?: string;
  description?: string;
}

export interface StripePaymentRequest {
  amount: number;
  currency?: string;
  serviceId?: string;
  serviceType?: string;
  customerEmail: string;
  customerName?: string;
}

export interface BankTransferPaymentRequest {
  amount: number;
  currency?: string;
  serviceId?: string;
  serviceType?: string;
  bankName?: string;
  accountNumber?: string;
}

// Notification Types
export interface Notification {
  id?: number;
  userId: string;
  type:
    | 'payment_success'
    | 'payment_failed'
    | 'service_request'
    | 'service_update'
    | 'system_alert';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Document Types
export interface Document {
  id?: number;
  userId: string;
  serviceId?: number;
  serviceType?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  companyName?: string;
  kraPin?: string;
  agreeToTerms: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalServices: number;
  pendingServices: number;
  completedServices: number;
  activeRequests: number;
  totalRevenue: number;
  recentPayments: Payment[];
  recentActivities: Notification[];
}

// Admin Stats
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  activeServices: number;
  userGrowth: number;
  revenueGrowth: number;
}

// Chart Data Types
export interface RevenueData {
  date: string;
  revenue: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface ServiceDistributionData {
  name: string;
  value: number;
}
