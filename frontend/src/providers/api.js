const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token') || 'demo-token'}`,
      },
      credentials: 'include',
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getRecentActivity(limit = 20) {
    return this.request(`/admin/dashboard/recent-activity?limit=${limit}`);
  }

  // Service Requests
  async getServiceRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/service-requests?${queryString}`);
  }

  async getServiceRequest(id) {
    return this.request(`/admin/service-requests/${id}`);
  }

  async updateServiceRequestStatus(id, status, data = {}) {
    return this.request(`/admin/service-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...data }),
    });
  }

  async assignServiceRequest(id, assignTo) {
    return this.request(`/admin/service-requests/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assigned_to: assignTo }),
    });
  }

  async addServiceRequestNote(id, notes, isInternal = false) {
    return this.request(`/admin/service-requests/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes, is_internal: isInternal }),
    });
  }

  // Users
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`);
  }

  // Payments
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/payments?${queryString}`);
  }

  async updatePaymentStatus(id, status, transactionId = null) {
    return this.request(`/admin/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, transaction_id: transactionId }),
    });
  }
}

export const api = new ApiService();
