import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Handle response errors
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post<{ user: any; token: string }>('/auth/login', { email, password });
  }

  async register(userData: any) {
    return this.post<{ user: any; token: string }>('/auth/register', userData);
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.get<{
      totalServices: number;
      pendingServices: number;
      completedServices: number;
      activeRequests: number;
      totalRevenue: number;
      newUsers: number;
    }>('/admin/dashboard-stats');
  }

  async getRecentActivities() {
    return this.get<any[]>('/admin/recent-activities');
  }

  async getRevenueData() {
    return this.get<any[]>('/admin/revenue-data');
  }

  async getUserGrowthData() {
    return this.get<any[]>('/admin/user-growth');
  }

  // User methods
  async getProfile() {
    return this.get('/users/profile');
  }

  async updateProfile(data: any) {
    return this.put('/users/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.post('/users/change-password', { currentPassword, newPassword });
  }

  // Data Services
  async getDataServices() {
    return this.get('/data-services/my-requests');
  }

  async createDataService(data: any) {
    return this.post('/data-services/request', data);
  }

  // Business Registration
  async getBusinessRegistrations() {
    return this.get('/business/my-registrations');
  }

  async createBusinessRegistration(data: any) {
    return this.post('/business/register', data);
  }

  // KRA Services
  async getKRAServices() {
    return this.get('/kra/my-services');
  }

  async createKRAService(data: any) {
    return this.post('/kra/pin-registration', data);
  }

  // Payments
  // async getPayments() {
  //   return this.get('/payments/history');
  // }

  // async createPayment(data: any) {
  //   return this.post('/payments/mpesa', data);
  // }

  // Payment methods
  async getPayments() {
    return this.get('/payments');
  }

  async getPayment(id: string) {
    return this.get(`/payments/${id}`);
  }

  async createPayment(data: any) {
    return this.post('/payments', data);
  }

  async updatePaymentStatus(id: string, data: { status: string; transaction_reference?: string }) {
    return this.put(`/payments/${id}/status`, data);
  }

  async getPaymentReceipt(id: string) {
    return this.get(`/payments/${id}/receipt`);
  }

  async getPaymentStats() {
    return this.get('/payments/stats');
  }

  // Upload file
  async uploadFile(file: File, serviceId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (serviceId) {
      formData.append('serviceId', serviceId);
    }

    return this.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Create singleton instance
export const api = new ApiService();
