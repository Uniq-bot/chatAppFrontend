"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import LocationProvider from "./Provider/LocationProvider";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "@/libs/useAuth";
import { consumePostNavToast, peekPostNavToast } from "@/libs/postNavToast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const dontShowNav = pathname === "/pages/Login" || pathname === "/pages/Register";
  const { loading, onlineUsers } = useAuth();

  // Show any queued toast only after navigation and when auth state is known
  useEffect(() => {
    if (loading) return;
    const pending = peekPostNavToast();
    if (!pending) return;
    const payload = consumePostNavToast();
    if (!payload) return;
    const { type = "success", message = "" } = payload;
    if (message) {
      const fn = toast[type] || toast;
      fn(message);
    }
  }, [pathname, loading]);
    console.log(onlineUsers)

  return (
    <div data-theme="retro">
      <LocationProvider>
      <Toaster
        position="top-right"
        gutter={10}
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
          },
          success: {
            duration: 5000,
          },
          error: {
            duration: 7000,
          },
        }}
      />
      {!dontShowNav && <NavBar />}
      {children}
    </LocationProvider>
    </div>
  );
}
