"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Users,
  CirclePlus,
} from "lucide-react";
import useAuth from "@/libs/useAuth";

const NavBar = () => {
  const { isAuthenticated, loading, logout, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved && typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", next);
      }
    } catch {}
  };

  const isActive = (href) => (pathname === href ? "btn-active" : "");

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className={`btn btn-ghost text-xl ${isActive("/")}`}>
          Chat
        </Link>
      </div>
      <div className="flex-none gap-3">
        {!loading && isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              href="/pages/createGroup"
              className={`btn btn-ghost gap-2 ${isActive(
                "/pages/createGroup"
              )}`}
            >
              <CirclePlus /> Create Group
            </Link>
            <Link
              href="/pages/joinGroup"
              className={`btn btn-ghost gap-2 ${isActive("/pages/joinGroup")}`}
            >
              <Users /> Join Group
            </Link>
            <Link
              href="/pages/profile"
              className={`btn btn-ghost gap-2 ${isActive("/pages/profile")}`}
            >
              <User className="w-5 h-5" />
              Profile
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
            <button
              onClick={toggleTheme}
              className="btn btn-ghost gap-2"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:inline" />
              <Moon className="w-5 h-5 inline dark:hidden" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/pages/Login" className="btn btn-ghost">
              Login
            </Link>
            <Link href="/pages/Register" className="btn btn-primary">
              Sign up
            </Link>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost gap-2"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:inline" />
              <Moon className="w-5 h-5 inline dark:hidden" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
