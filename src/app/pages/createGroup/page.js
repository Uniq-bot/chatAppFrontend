"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";
import { Loader2, MessageSquare, Users, Camera, Sparkles, ArrowRight } from "lucide-react";
import AuthImagePattern from "@/components/AuthPattern";
import useAuth from "@/libs/useAuth";

const CreateGroupPage = () => {
    const {createGroup}=useAuth();
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image is too large (max 5MB)");
      return;
    }

    setImageFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return false;
    }
    if (groupName.trim().length < 3) {
      toast.error("Group name must be at least 3 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCreating(true);
    try {
     await createGroup({ name: groupName.trim(), image: imageFile });
      toast.success("Group created successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating group");
      console.error("Create group error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid lg:grid-cols-1 bg-base-200">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-16 rounded-2xl bg-primary
                flex items-center justify-center group-hover:scale-105 transition-all duration-300 
                shadow-lg"
              >
                <MessageSquare className="size-8 text-primary-content" />
              </div>
              <h1 className="text-3xl font-bold mt-4 text-primary">
                Create Group
              </h1>
              <p className="text-base-content/70 text-sm">Start a new group conversation and collaborate</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group Image */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      Group Image
                    </span>
                    <span className="label-text-alt text-base-content/50">Optional</span>
                  </label>
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed 
                    border-base-300 rounded-lg hover:border-primary/50 transition-colors">
                    <div className="relative group">
                      <div className="avatar">
                        <div className="w-24 rounded-full ring-4 ring-primary ring-offset-base-100 
                          ring-offset-2 transition-all group-hover:ring-secondary">
                          {selectedImage ? (
                            <Image 
                              src={selectedImage} 
                              alt="Group preview" 
                              className="object-cover rounded-full"
                              width={96}
                              height={96}
                            />
                          ) : (
                            <div className="flex items-center justify-center bg-base-200 w-full h-full rounded-full">
                              <Users className="size-10 text-base-content/30" />
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedImage && (
                        <div className="absolute inset-0 rounded-full bg-black/0 
                          group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Camera className="size-6 text-white opacity-0 group-hover:opacity-100 
                            transition-opacity" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="group-image-upload"
                      className="btn btn-sm btn-outline gap-2 hover:btn-primary"
                    >
                      <Camera className="size-4" />
                      {selectedImage ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        id="group-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={isCreating}
                      />
                    </label>
                    <p className="text-xs text-base-content/50">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Group Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      Group Name
                    </span>
                    <span className="label-text-alt text-base-content/50">Required</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="size-3 text-primary" />
                      </div>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10 focus:input-primary 
                        transition-all"
                      placeholder="e.g., Team Workspace, Study Group"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/50">
                      Minimum 3 characters
                    </span>
                    <span className={`label-text-alt ${
                      groupName.length >= 3 ? "text-success" : "text-base-content/40"
                    }`}>
                      {groupName.length}/50
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-xl 
                    transition-all group"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Creating Group...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-5" />
                      Create Group
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

       
        </div>
      </div>

     
    </div>
  );
};

export default CreateGroupPage;