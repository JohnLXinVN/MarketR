// src/utils/api.ts
"use client";

import axios from "axios";

// ✅ Tạo instance axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // đổi URL backend nếu cần
  timeout: 10000,
});

// ✅ Thêm interceptor để tự động gắn token từ localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("access_token_exp");
      // Optional: redirect login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
