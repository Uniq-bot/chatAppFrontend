"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  LogOut,
  Sun,
  Moon,
  Users,
  CirclePlus,
  Search,
} from "lucide-react";
import useAuth from "@/libs/useAuth";
import { useChatMessage } from "@/libs/useChatMessage";

const NavBar = () => {
  const { isAuthenticated, loading, logout, checkAuth, getSearchedUser, fetchContacts } = useAuth();
  const { setSelectedUser } = useChatMessage();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      setIsSearching(true);
      try {
        const results = await getSearchedUser(query);
        setSearchResults(results || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4 min-h-[56px] sm:min-h-[64px]">
      <div className="flex-1 min-w-0">
        <Link href="/" className={`btn btn-ghost text-base sm:text-xl px-2 sm:px-4 ${isActive("/")}`}>
          Chat
        </Link>
      </div>
      {!loading && isAuthenticated && (
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-4 search-container relative">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered input-sm w-full pl-10 pr-4"
            />
          </div>
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 shadow-lg rounded-lg border border-base-300 max-h-80 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-3 py-2 hover:bg-base-200 flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={user.pic || "/avatar.png"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-left min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">No users found</div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="flex-none">
        {!loading && isAuthenticated ? (
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            <Link
              href="/pages/createGroup"
              className={`btn btn-ghost btn-sm px-2 sm:px-3 ${isActive("/pages/createGroup")}`}
              title="Create Group"
            >
              <CirclePlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">Create</span>
            </Link>
            <Link
              href="/pages/joinGroup"
              className={`btn btn-ghost btn-sm px-2 sm:px-3 ${isActive("/pages/joinGroup")}`}
              title="Join Group"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">Join</span>
            </Link>
            <Link
              href="/pages/profile"
              className={`btn btn-ghost btn-sm px-2 sm:px-3 ${isActive("/pages/profile")}`}
              title="Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">Profile</span>
            </Link>
            <button
              onClick={() => {
                logout();
                router.replace("/pages/Login");
              }}
              className="btn btn-ghost btn-sm px-2 sm:px-3 text-error hover:bg-error/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">Logout</span>
            </button>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 hidden dark:inline" />
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 inline dark:hidden" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/pages/Login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/pages/Register" className="btn btn-primary btn-sm">
              Sign up
            </Link>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 hidden dark:inline" />
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 inline dark:hidden" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
