"use client";

import React, { useEffect, useRef, useState } from "react";
import useAuth from "@/libs/useAuth";
import { useRouter } from "next/navigation";
import { Mail, Calendar, Camera, Loader2 } from "lucide-react";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, loading, isAuthenticated, checkAuth, isUpdatingProfile, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/pages/Login");
    }
  }, [loading, isAuthenticated, router]);
const handlePickFile = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return;
  }
  const maxSize = 5 * 1024 * 1024; // 5MB to match backend limit
  if (file.size > maxSize) {
    toast.error("Image is too large (max 5MB)");
    return;
  }
  setSelectedImage(URL.createObjectURL(file));
  const fd = new FormData();
  fd.append("pic", file);
  await updateProfile(fd);
  toast.success("Profile picture updated successfully");
};
  const created = user?.createdAt ? new Date(user.createdAt) : null;
  const createdText = created ? created.toLocaleString() : "—";

 


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body items-center text-center">
          <div className="relative">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img alt="avatar" src={selectedImage || user?.pic} />
              </div>
            </div>
            
         <label htmlFor="avatar-upload" className={`
            absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}>
            <Camera className="w-5 h-5 text-base-200" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handlePickFile}
              disabled={isUpdatingProfile}
            />
         </label>
          </div>
          <h2 className="card-title mt-3">{user?.name || "User"}</h2>
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center gap-3 justify-center">
              <Mail className="w-5 h-5 text-base-content/60" />
              <span className="text-base-content/80">{user?.email || "—"}</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Calendar className="w-5 h-5 text-base-content/60" />
              <span className="text-base-content/80">Joined {createdText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
