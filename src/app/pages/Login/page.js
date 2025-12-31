"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "@/libs/useAuth";
import AuthImagePattern from "@/components/AuthPattern";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { GuardHook } from "@/libs/guardHook";
import { setPostNavToast } from "@/libs/postNavToast";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn, isAuthenticated, loading, checkAuth } = useAuth();

  // Prevent access when already logged in
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    GuardHook(isAuthenticated, loading);
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      setPostNavToast({ type: "success", message: "Logged in successfully" });
      router.replace("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-12">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-sm sm:text-base text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm sm:text-base font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 input-sm sm:input-md`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm sm:text-base font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 sm:h-5 w-4 sm:w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 input-sm sm:input-md`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 sm:h-5 w-4 sm:w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-4 sm:h-5 w-4 sm:w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-sm sm:btn-md" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                  <span className="text-xs sm:text-base">Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm sm:text-base text-base-content/60">
              Don&apos;t have an account?{" "}
              <span
                className="link link-primary cursor-pointer"
                onClick={() => router.push("/pages/Register")}
              >
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default LoginPage;