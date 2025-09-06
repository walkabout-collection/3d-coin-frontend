"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, navLinksAuth } from "./data";
import { NavbarProps, User } from "./types";

const Navbar: React.FC<NavbarProps> = ({ transparent = false, className = "" }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null); // Track active auth link
  const pathname = usePathname();

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
    updateUserData();
    const handleStorageChange = () => updateUserData();
    window.addEventListener("userChanged", handleStorageChange);
    return () => window.removeEventListener("userChanged", handleStorageChange);
  }, []);

  useEffect(() => {
    updateUserData();
    // Set active link based on current pathname
    if (pathname === navLinksAuth[1].href) {
      setActiveLink(navLinksAuth[1].href);
    } else if (pathname === navLinksAuth[0].href) {
      setActiveLink(navLinksAuth[0].href);
    } else {
      setActiveLink(null);
    }
  }, [pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     window.dispatchEvent(new Event("userChanged"));
//     setUserData(null);
//     router.push("/signin");
//   };

  const isActiveLink = (href: string): boolean => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${className} ${transparent ? "bg-transparent" : ""}`}>
      <div className="bg-gradient-to-r from-[#0F1C2E] to-[#1E3A6B] shadow-lg h-20">
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

          {/* Navigation Links */}
          <div className="flex items-center space-x-14">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white text-base font-medium hover:text-amber-400 ${
                  isActiveLink(item.href) ? "text-amber-400 font-semibold" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* User Authentication Section */}
          {userData ? (
            <div className="flex items-center space-x-6">
              <button className="text-white hover:text-amber-400 transition-colors">
                <Image
                  src="/images/navbar/shopping-cart.svg"
                  alt="Shopping Cart"
                  width={25}
                  height={25}
                />
              </button>
              <button className="relative text-white hover:text-amber-400 transition-colors">
                <Image
                  src="/images/navbar/notification.svg"
                  alt="Notifications"
                  width={25}
                  height={25}
                />
              </button>
              <button className="w-12 h-12 rounded-full">
                <Image
                  src="/images/navbar/profile.svg"
                  alt="Profile"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href={navLinksAuth[1].href}>
                <button
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    activeLink === navLinksAuth[1].href
                      ? "bg-ternary-light text-black shadow-2xl shadow-ternary-light"
                      : "bg-transparent text-white hover:bg-ternary-light hover:text-black"
                  }`}
                >
                  {navLinksAuth[1].title}
                </button>
              </Link>
              <Link href={navLinksAuth[0].href}>
                <button
                  className={`px-4 py-2 rounded-full font-medium ${
                    activeLink === navLinksAuth[0].href
                      ? "bg-ternary-light text-black shadow-2xl shadow-ternary-light"
                      : "bg-transparent text-white hover:bg-ternary-light hover:text-black"
                  }`}
                >
                  {navLinksAuth[0].title}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;