// src/api/httpClient.ts
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

export interface AppError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Convert any Axios error → AppError
function toAppError(error: unknown): AppError {
  const err = error as AxiosError<unknown>;

  if (err.response) {
    const data = err.response.data as Record<string, unknown>;
    return {
      message: (typeof data?.message === 'string' ? data.message : 'Server error'),
      status: err.response.status,
      code: (typeof data?.code === 'string' ? data.code : undefined),
      details: err.response.data,
    };
  }

  if (err.request) {
    return {
      message: 'No response from server. Please check your network.',
    };
  }

  return {
    message: err.message || 'Unexpected error',
  };
}

// Generic request wrapper
async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await http.request<T>(config);
    //console.log('HTTP Request:', config.method, config.url, res.data);
    return res.data;
  } catch (error) {
    throw toAppError(error);
  }
}

// Shorthand methods
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  post: <T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data: body }),
  put: <T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data: body }),
  del: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
  patch: <T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data: body }),
};