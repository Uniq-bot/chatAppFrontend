"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, Sun, Moon } from "lucide-react";
import useAuth from "@/libs/useAuth";

const NavBar = () => {
  const { user, isAuthenticated, loading, logout, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Chat
        </Link>
      </div>
      <div className="flex-none gap-3">
        {!loading && isAuthenticated ? (
          <div className="flex items-center gap-3">
           
            <Link href="/pages/profile" className="btn btn-ghost gap-2">
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link href="/pages/profile" className="btn btn-ghost gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button
              onClick={() => {
                logout();
                router.replace("/pages/Login");
              }}
              className="btn btn-outline btn-error gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
            <button onClick={toggleTheme} className="btn btn-ghost gap-2" aria-label="Toggle theme">
              <Sun className="w-5 h-5 hidden dark:inline" />
              <Moon className="w-5 h-5 inline dark:hidden" />
              Theme
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/pages/Login" className="btn btn-ghost">Login</Link>
            <Link href="/pages/Register" className="btn btn-primary">Sign up</Link>
            <button onClick={toggleTheme} className="btn btn-ghost gap-2" aria-label="Toggle theme">
              <Sun className="w-5 h-5 hidden dark:inline" />
              <Moon className="w-5 h-5 inline dark:hidden" />
              Theme
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
