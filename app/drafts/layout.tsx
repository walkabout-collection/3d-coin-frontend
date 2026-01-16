"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserProfilesLayoutProps } from "@/src/containers/dashboard/types";
import { sidebarItems } from "@/src/containers/dashboard/data";
import { useLogout } from "@/src/hooks/useQueries";
import { LogOut } from "lucide-react";

export default function DraftsLayout({ children }: UserProfilesLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Handle Escape key to close logout confirmation modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLogoutConfirm) {
        handleCancelLogout();
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (showLogoutConfirm) {
        document.body.style.overflow = "unset";
      }
    };
  }, [showLogoutConfirm]);

  const mainItems = sidebarItems.filter(
    (item) => item.name !== "Account Setting" && item.name !== "Log Out",
  );
  const bottomItems = sidebarItems.filter(
    (item) => item.name === "Account Setting" || item.name === "Log Out",
  );

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-20 w-64 bg-[#f5f7fa] shadow-lg p-4 flex flex-col justify-between h-[calc(100vh-5rem)] overflow-y-auto z-40">
        {/* Top navigation */}
        <nav className="flex flex-col space-y-4">
          {mainItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-4 rounded-lg font-semibold transition-all duration-200
                  hover:bg-[#e3e7ee] 
                  ${
                    isActive
                      ? "bg-[#1a2a3a] text-white"
                      : "text-gray-700 hover:text-primary"
                  }
                `}
              >
                <div className="w-5 h-5 relative flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    fill
                    className={`object-contain ${
                      isActive ? "filter brightness-0 invert" : ""
                    }`}
                  />
                </div>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <nav className="flex flex-col space-y-2 mt-6">
          {bottomItems.map((item) => {
            if (item.name === "Log Out") {
              return (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-[#e3e7ee] cursor-pointer"
                >
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image
                      src={item.icon}
                      alt={`${item.name} icon`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            }

            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
                  hover:bg-[#e3e7ee] 
                  ${
                    isActive
                      ? "bg-[#1a2a3a] text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }
                `}
              >
                <div className="w-5 h-5 relative flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    fill
                    className={`object-contain ${
                      isActive ? "filter brightness-0 invert" : ""
                    }`}
                  />
                </div>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-col flex-1 bg-white ml-64">
        <main className="flex-grow p-6">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
          onClick={handleCancelLogout}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Are you sure you want to logout?
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
                You will need to log in again to access your account and
                continue your work.
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelLogout}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
