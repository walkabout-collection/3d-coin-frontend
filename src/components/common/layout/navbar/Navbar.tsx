"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { navLinks, navLinksAuth } from "./data";
import { NavbarProps } from "./types";
import { useLogout, useGetUserProfile } from "@/src/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface TokenPayload {
  role?: "USER" | "ADMIN";
  exp?: number;
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Helper function to get user initials
const getUserInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last || "U";
};

// (removed unused getUserFullName helper)

const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  className = "",
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userRole, setUserRole] = useState<"USER" | "ADMIN" | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const previousLoggedInRef = useRef<boolean>(false);

  // Fetch user profile
  const { data: userProfile, refetch: refetchProfile } = useGetUserProfile({
    queryKey: ["userProfile"],
    enabled: isLoggedIn,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh data
  });

  // Refetch profile when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      // Small delay to ensure token is set in cookies
      const timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        refetchProfile();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, queryClient, refetchProfile]);

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
      window.dispatchEvent(new Event("authChanged"));
      router.push("/login");
    },
    onError: (err) => {
      console.error("Logout failed:", err.message);
    },
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("token");
      const newLoggedIn = !!token;
      const previousLoggedIn = previousLoggedInRef.current;

      setIsLoggedIn(newLoggedIn);

      // Decode token to get user role
      if (token) {
        try {
          const payload = jwtDecode<TokenPayload>(token);
          setUserRole(payload.role || "USER");
        } catch (err) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

      // If user just logged in (wasn't logged in before, but now is), refetch profile
      if (!previousLoggedIn && newLoggedIn) {
        // Invalidate and refetch user profile
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setTimeout(() => {
          refetchProfile();
        }, 100);
      }

      // Update ref for next check
      previousLoggedInRef.current = newLoggedIn;
    };

    // Initial check
    const token = getCookie("token");
    previousLoggedInRef.current = !!token;
    setIsLoggedIn(!!token);

    // Decode initial token
    if (token) {
      try {
        const payload = jwtDecode<TokenPayload>(token);
        setUserRole(payload.role || "USER");
      } catch (err) {
        setUserRole(null);
      }
    }

    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, [queryClient, refetchProfile]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveLink = (href: string): boolean => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const shouldShowShadow =
    (pathname !== "/" && pathname !== "/pricing") || isScrolled;

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsPopupOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${className} ${
        transparent ? "bg-transparent" : ""
      }`}
    >
      <div
        className={`bg-gradient-to-r from-[#0F1C2E] to-[#1E3A6B] h-20 ${
          shouldShowShadow ? "shadow-lg" : ""
        }`}
      >
        <div className="container-fluid flex items-center justify-between h-full px-8 relative">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity z-10"
          >
            <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/navbar/legacy-forge-icon.svg"
                alt="Legacy Forge Icon"
                width={48}
                height={48}
                className="object-contain w-auto h-auto"
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="hidden sm:block h-auto w-auto flex items-center">
              <Image
                src="/images/navbar/legacy-forge.svg"
                alt="Legacy Forge"
                width={150}
                height={80}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-14">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? "text-amber-400 font-semibold"
                    : "text-white hover:text-amber-400"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {isLoggedIn ? (
            <div className="flex items-center space-x-6 relative z-10">
              <div className="flex items-center space-x-3">
                {/* User Name */}
                <span className="text-white font-medium text-sm">
                  {userProfile?.firstName || "User"}
                </span>

                {/* Profile Avatar/Button Container - relative for dropdown positioning */}
                <div className="relative">
                  {/* Profile Avatar/Button */}
                  <button
                    className="w-12 h-12 rounded-full relative overflow-hidden border-2 border-white/30 hover:border-amber-400 transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 hover:scale-105 active:scale-95"
                    onClick={togglePopup}
                    aria-label="User menu"
                    aria-expanded={isPopupOpen}
                  >
                    <span className="text-white font-semibold text-lg transition-transform duration-200">
                      {userProfile
                        ? getUserInitials(
                            userProfile.firstName,
                            userProfile.lastName,
                          )
                        : "U"}
                    </span>
                  </button>

                  {/* Popup Menu */}
                  <div
                    ref={popupRef}
                    className={`absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden w-56 z-50 transition-all duration-200 ease-out origin-top-right ${
                      isPopupOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
                    }`}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {userProfile
                              ? getUserInitials(
                                  userProfile.firstName,
                                  userProfile.lastName,
                                )
                              : "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {userProfile?.firstName && userProfile?.lastName
                              ? `${userProfile.firstName} ${userProfile.lastName}`
                              : userProfile?.firstName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userProfile?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1.5">
                      <Link
                        href={userRole === "ADMIN" ? "/admin" : "/dashboard"}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-all duration-150 group"
                        onClick={() => setIsPopupOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400 group-hover:text-[#1a2a3a] transition-colors" />
                        <span className="text-sm font-medium flex-1">
                          Dashboard
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100" />
                      </Link>
                      <Link
                        href={
                          userRole === "ADMIN"
                            ? "/admin/account-setting"
                            : "/dashboard/account-setting"
                        }
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-all duration-150 group"
                        onClick={() => setIsPopupOpen(false)}
                      >
                        <Settings className="h-4 w-4 text-gray-400 group-hover:text-[#1a2a3a] transition-colors" />
                        <span className="text-sm font-medium flex-1">
                          Account Settings
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100" />
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-1"></div>

                    {/* Logout Button */}
                    <div className="px-1.5 pb-1.5">
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-150 rounded-lg group"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 z-10">
              {navLinksAuth.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`px-4 py-2 rounded-full font-medium transition cursor-pointer ${
                      isActiveLink(item.href)
                        ? "text-black bg-gradient-to-b from-[#FFD700] to-[#FFC300] shadow-[0_6px_12px_rgba(255,215,0,0.6)] hover:from-[#FFC107] hover:to-[#FF8C00]"
                        : "bg-transparent text-white hover:bg-ternary-light hover:text-black"
                    }`}
                  >
                    {item.title}
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
