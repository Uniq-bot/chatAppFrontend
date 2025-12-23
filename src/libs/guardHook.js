"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Utility function used inside useEffect in pages
export const GuardHook = (isAuthenticated, loading, redirectTo = "/") => {
  if (typeof window === "undefined") return;
  if (!loading && isAuthenticated) {
    window.location.replace(redirectTo);
  }
};

// React hook variant for new usage patterns
export const useGuestGuard = (isAuthenticated, loading, redirectTo = "/") => {
  const router = useRouter();
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);
};
