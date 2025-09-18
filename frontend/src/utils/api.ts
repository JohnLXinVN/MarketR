"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 10000,
});

// 🟢 Request interceptor → gắn token
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
  (err) => Promise.reject(err)
);

// 🔴 Response interceptor → bắt lỗi 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("❌ Token hết hạn hoặc không hợp lệ, redirect login...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("access_token_exp");
      window.location.href = "/login"; // redirect về login
    }
    return Promise.reject(err);
  }
);

export default api;
