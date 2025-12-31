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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center p-6 sm:p-8">
            <div className="relative">
              <div className="avatar">
                <div className="w-20 sm:w-24 md:w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img alt="avatar" src={selectedImage || user?.pic} />
                </div>
              </div>
              
              <label htmlFor="avatar-upload" className={`
                absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 sm:p-2 cursor-pointer 
                hover:bg-primary-focus transition-colors
                ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}>
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-base-200" />
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
            <h2 className="card-title mt-4 text-lg sm:text-xl md:text-2xl">{user?.name || "User"}</h2>
            <div className="w-full mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 justify-center flex-wrap">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/60 flex-shrink-0" />
                <span className="text-sm sm:text-base text-base-content/80 break-all">{user?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 justify-center flex-wrap">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/60 flex-shrink-0" />
                <span className="text-sm sm:text-base text-base-content/80">Joined {createdText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
