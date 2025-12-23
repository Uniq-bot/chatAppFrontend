import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  
  withCredentials: true,
});

// Attach Authorization header from localStorage token on every request
axiosInstance.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore storage errors
  }
  return config;
});