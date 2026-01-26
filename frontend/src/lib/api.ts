import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // GET request
  async get<T = any>(url: string, config?: ApiConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: ApiConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: ApiConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: ApiConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE request
  async delete<T = any>(url: string, config?: ApiConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload file
  async upload<T = any>(url: string, file: File, data?: any): Promise<T> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
      }

      const response: AxiosResponse<T> = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle errors
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'An error occurred';

      return new Error(message);
    }

    return new Error('An unexpected error occurred');
  }
}

// Create singleton instance
export const api = new ApiClient();

// Convenience functions
export const apiGet = api.get.bind(api);
export const apiPost = api.post.bind(api);
export const apiPut = api.put.bind(api);
export const apiPatch = api.patch.bind(api);
export const apiDelete = api.delete.bind(api);
export const apiUpload = api.upload.bind(api);
