"use client";

import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URI = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:5000";


const useAuth = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: true, // checkAuth in progress
  isSigningUp: false,
  isLoggingIn: false,
  socket:null,
  onlineUsers:null,
  connectSocket:()=>{
    const {user}=get();
    if(!user || get().socket?.connected ) return;
    const socket=io(BASE_URI, {
      query: { userId: user._id },
    });
    socket.connect();
    set({socket});

    socket.on('onlineUsers', (onlineUsersId)=>{
      set({onlineUsers: onlineUsersId});
    });
    
  },
  disconnectSocket:()=>{},

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
      get().connectSocket();

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
      get().connectSocket();
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
      const res = await axiosInstance.post("/auth/register", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      set({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
        isSigningUp: false,
      });
      get().connectSocket();
      return res;
    } catch (err) {
      set({ isSigningUp: false });
      console.error("Signup error:", err);
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null, loading: false });
    get().disconnectSocket();
  },
  createGroup:async(groupData)=>{
    try {
      const formData = new FormData();
      formData.append("name", groupData.name);
      if (groupData.image) {
        formData.append("pic", groupData.image);
      }
      // Don't set Content-Type manually - let axios set it with boundary
      const res = await axiosInstance.post("/auth/createGroup", formData);
      console.log(res)
      return res;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
  fetchGroups:async()=>{
    try {
      const res= await axiosInstance.get("/groups/all");
      console.log(res)
      return res.data.groups;
    } catch (error) {

      console.log(error)
      
    }
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
  },

}));

export default useAuth;
