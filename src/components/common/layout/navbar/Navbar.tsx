"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { navLinks, navLinksAuth } from "./data";
import { NavbarProps, User } from "./types";
import { useLogout } from "@/src/hooks/useQueries"; 
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  className = "",
}) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const pathname = usePathname();
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null); 

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

  const updateUserData = () => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (error) {
        console.error("Failed to parse userData from localStorage:", error);
        localStorage.removeItem("user");
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, []);

  useEffect(() => {
    updateUserData();
    const handleStorageChange = () => updateUserData();
    window.addEventListener("userChanged", handleStorageChange);
    return () => window.removeEventListener("userChanged", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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


  const togglePopup = () => {
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
        <div className="container-fluid flex items-center justify-between h-full px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-36 h-20 rounded-full flex items-center justify-center px-4">
              <Image
                src="/images/navbar/legacy-forge-icon.svg"
                alt="Legacy Forge Icon"
                width={80}
                height={60}
                priority
              />
              <Image
                src="/images/navbar/legacy-forge.svg"
                alt="Legacy Forge"
                width={150}
                height={80}
                priority
              />
            </div>
          </Link>

          <div className="flex items-center space-x-14">
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
            <div className="flex items-center space-x-6 relative">
              <button className="text-white hover:text-amber-400 transition-colors">
                <Image
                  src="/images/navbar/shopping-cart.svg"
                  alt="Shopping Cart"
                  width={25}
                  height={25}
                />
              </button>

              <button
                className="w-12 h-12 rounded-full relative"
                onClick={togglePopup}
              >
                <Image
                  src="/images/navbar/profile.svg"
                  alt="Profile"
                  width={40}
                  height={40}
                />
              </button>

              {/* Popup Menu */}
              {isPopupOpen && (
                <div
                  ref={popupRef}
                  className="absolute top-16 right-0 bg-white shadow-xl rounded-lg py-2 w-48 z-50"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 font-medium hover:bg-gray-100"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-800 font-medium hover:bg-gray-100"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-800 font-medium hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
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