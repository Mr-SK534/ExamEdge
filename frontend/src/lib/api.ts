// frontend/src/lib/api.ts
// Fully cleaned & optimized for Sonner + Next.js 14 + TypeScript

import axios from "axios";

const api = axios.create({
  baseURL:  "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor → Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → Only handle 401 (auto logout), let components show toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear(); // or just remove token & user
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Standard response shape your backend should return
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const apiClient = {
  get: <T>(url: string, params?: any) =>
    api.get<ApiResponse<T>>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: any) =>
    api.post<ApiResponse<T>>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any) =>
    api.put<ApiResponse<T>>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: any) =>
    api.patch<ApiResponse<T>>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    api.delete<ApiResponse<T>>(url).then((res) => res.data),
};

export default api;
export { apiClient };