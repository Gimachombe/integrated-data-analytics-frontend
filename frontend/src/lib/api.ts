// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// interface ApiResponse<T = any> {
//   success: boolean;
//   data: T;
//   message?: string;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// class ApiService {
//   private baseUrl: string;

//   constructor() {
//     this.baseUrl = API_BASE_URL;
//   }

//   private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
//     const url = `${this.baseUrl}${endpoint}`;

//     const defaultOptions: RequestInit = {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('admin_token') || 'demo-token'}`,
//       },
//       credentials: 'include',
//     };

//     const response = await fetch(url, {
//       ...defaultOptions,
//       ...options,
//       headers: {
//         ...defaultOptions.headers,
//         ...options.headers,
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({
//         message: 'An error occurred',
//       }));
//       throw new Error(error.message || `HTTP ${response.status}`);
//     }

//     return response.json();
//   }

//   // Dashboard endpoints
//   getDashboardStats() {
//     return this.request('/admin/dashboard/stats');
//   }

//   getRecentActivity(limit = 20) {
//     return this.request(`/admin/dashboard/recent-activity?limit=${limit}`);
//   }

//   // Service Requests endpoints
//   getServiceRequests(params: Record<string, any> = {}) {
//     const queryString = new URLSearchParams(params).toString();
//     return this.request(`/admin/service-requests?${queryString}`);
//   }

//   getServiceRequest(id: string) {
//     return this.request(`/admin/service-requests/${id}`);
//   }

//   updateServiceRequestStatus(id: string, status: string, data: Record<string, any> = {}) {
//     return this.request(`/admin/service-requests/${id}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status, ...data }),
//     });
//   }

//   assignServiceRequest(id: string, assignTo: string) {
//     return this.request(`/admin/service-requests/${id}/assign`, {
//       method: 'PATCH',
//       body: JSON.stringify({ assigned_to: assignTo }),
//     });
//   }

//   addServiceRequestNote(id: string, notes: string, isInternal = false) {
//     return this.request(`/admin/service-requests/${id}/notes`, {
//       method: 'POST',
//       body: JSON.stringify({ notes, is_internal: isInternal }),
//     });
//   }

//   // Users endpoints
//   getUsers(params: Record<string, any> = {}) {
//     const queryString = new URLSearchParams(params).toString();
//     return this.request(`/admin/users?${queryString}`);
//   }

//   // Payments endpoints
//   getPayments(params: Record<string, any> = {}) {
//     const queryString = new URLSearchParams(params).toString();
//     return this.request(`/admin/payments?${queryString}`);
//   }

//   updatePaymentStatus(id: string, status: string, transactionId?: string) {
//     return this.request(`/admin/payments/${id}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status, transaction_id: transactionId }),
//     });
//   }
// }

// export const api = new ApiService();







// lib/api.ts
/**
 * Central API client service for admin-related endpoints.
 * Uses fetch with proper error handling, auth token from localStorage,
 * and consistent response typing.
 */

'use client'; // Ensures this is treated as a client-side module (important in Next.js App Router)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL.endsWith('/')
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL;

    if (!this.baseUrl) {
      console.warn('[ApiService] API_BASE_URL is empty or undefined. Using fallback.');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[ApiService] Initialized with base URL:', this.baseUrl);
    }
  }

  /**
   * Get the admin JWT token from localStorage (client-side only)
   */
  private getAuthToken(): string {
    if (typeof window === 'undefined') {
      return ''; // Server-side rendering → no token
    }
    return localStorage.getItem('admin_token') || '';
  }

  /**
   * Core request method with error handling and JSON parsing
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    // Normalize endpoint (always start with /)
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header only if we have a token
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Keep cookies / credentials if needed
    };

    try {
      const response = await fetch(url, fetchOptions);

      let json: any;
      try {
        json = await response.json();
      } catch {
        json = { message: 'Response is not valid JSON' };
      }

      if (!response.ok) {
        const errorMessage =
          json?.message ||
          json?.error ||
          `Request failed (${response.status} ${response.statusText})`;
        
        console.error(`[ApiService] ${options.method || 'GET'} ${path} → ${response.status}`, {
          message: errorMessage,
          response: json,
        });

        throw new Error(errorMessage);
      }

      return json as ApiResponse<T>;
    } catch (err) {
      console.error(`[ApiService] Network/Request error on ${path}:`, err);
      throw err instanceof Error ? err : new Error('Unknown fetch error');
    }
  }

  // ────────────────────────────────────────────────
  // Dashboard endpoints
  // ────────────────────────────────────────────────
  async getDashboardStats() {
    return this.request<{ stats: any; overview?: any }>('/admin/dashboard/stats');
  }

  async getRecentActivity(limit = 10) {
    return this.request<any>(`/admin/dashboard/recent-activity?limit=${limit}`);
  }

  // ────────────────────────────────────────────────
  // Service Requests
  // ────────────────────────────────────────────────
  async getServiceRequests(params: Record<string, string | number | boolean> = {}) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();

    const path = query ? `/admin/service-requests?${query}` : '/admin/service-requests';
    return this.request<any>(path);
  }

  async getServiceRequest(id: string) {
    if (!id) throw new Error('Service request ID is required');
    return this.request<any>(`/admin/service-requests/${id}`);
  }

  async updateServiceRequestStatus(id: string, status: string, extraData: Record<string, any> = {}) {
    if (!id || !status) throw new Error('ID and status are required');
    return this.request<any>(`/admin/service-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...extraData }),
    });
  }

  async assignServiceRequest(id: string, assignedTo: string) {
    if (!id || !assignedTo) throw new Error('ID and assigned_to are required');
    return this.request<any>(`/admin/service-requests/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assigned_to: assignedTo }),
    });
  }

  async addServiceRequestNote(id: string, note: string, isInternal = false) {
    if (!id || !note) throw new Error('ID and note content are required');
    return this.request<any>(`/admin/service-requests/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({
        notes: note,
        is_internal: isInternal,
      }),
    });
  }

  // ────────────────────────────────────────────────
  // Users
  // ────────────────────────────────────────────────
  async getUsers(params: Record<string, string | number> = {}) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return this.request<any>(`/admin/users${query ? `?${query}` : ''}`);
  }

  // ────────────────────────────────────────────────
  // Payments
  // ────────────────────────────────────────────────
  async getPayments(params: Record<string, string | number> = {}) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return this.request<any>(`/admin/payments${query ? `?${query}` : ''}`);
  }

  async updatePaymentStatus(id: string, status: string, transactionId?: string) {
    if (!id || !status) throw new Error('ID and status are required');
    return this.request<any>(`/admin/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        ...(transactionId && { transaction_id: transactionId }),
      }),
    });
  }
}

// Singleton export
export const api = new ApiService();