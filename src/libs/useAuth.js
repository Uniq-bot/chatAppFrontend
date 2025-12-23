"use client";

import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

const useAuth = create((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true, // checkAuth in progress
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    set({ loading: true }); // start loading

    const token = localStorage.getItem("token");

    if (!token) {
      set({ isAuthenticated: false, user: null, loading: false });
      return;
    }

    try {
      const res = await axiosInstance.get("/checkAuth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
      });
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },

  login: async (userData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", userData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      set({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
        isLoggingIn: false,
      });

      return res;
    } catch (err) {
      set({ isLoggingIn: false });
      throw err;
    }
  },

  signup: async ({ fullName, email, password, image }) => {
    try {
      set({ isSigningUp: true });
      const payload = { name: fullName, email, password, image };
      const res = await axiosInstance.post("/auth/register", payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      set({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
        isSigningUp: false,
      });
      return res;
    } catch (err) {
      set({ isSigningUp: false });
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null, loading: false });
  },
  isUpdatingProfile: false,
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const token = localStorage.getItem("token");
      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" }),
      };

      const res = await axiosInstance.put("/auth/update-profile", data, { headers });
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      console.log(error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}));

export default useAuth;
