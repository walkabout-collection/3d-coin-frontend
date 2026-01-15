"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { sidebarItems } from "@/src/containers/admin/dashboard/data";
import { AdminLayoutProps } from "@/src/containers/admin/dashboard/types";
import { useLogout } from "@/src/hooks/useQueries";

interface TokenPayload {
  role?: "USER" | "ADMIN";
  exp?: number;
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Client-side authorization check
  useEffect(() => {
    const checkAuthorization = () => {
      const token = getCookie("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const payload = jwtDecode<TokenPayload>(token);

        // Check if token is expired
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          router.push("/login");
          return;
        }

        // Require ADMIN role
        if (payload.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        // Invalid token
        router.push("/login");
      }
    };

    checkAuthorization();
  }, [router]);

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

  const mainItems = sidebarItems.filter(
    (item) => item.name !== "Account Setting" && item.name !== "Log Out",
  );
  const bottomItems = sidebarItems.filter(
    (item) => item.name === "Account Setting" || item.name === "Log Out",
  );

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authorized (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-20 w-64 bg-[#f5f7fa] shadow-lg p-4 flex flex-col justify-between h-[calc(100vh-5rem)] overflow-y-auto z-40">
        {/* Top navigation */}
        <nav className="flex flex-col space-y-4">
          {mainItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-4 rounded-lg font-semibold transition-all duration-200
                  hover:bg-[#e3e7ee] 
                  ${isActive ? "bg-[#1a2a3a] text-white" : "text-gray-700 hover:text-primary"}
                `}
              >
                <div className="w-5 h-5 relative flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    fill
                    className={`object-contain ${isActive ? "filter brightness-0 invert" : ""}`}
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
                  onClick={() => logout()}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-[#e3e7ee]"
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

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
                  hover:bg-[#e3e7ee] 
                  ${isActive ? "bg-[#1a2a3a] text-white" : "text-gray-700 hover:text-gray-900"}
                `}
              >
                <div className="w-5 h-5 relative flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    fill
                    className={`object-contain ${isActive ? "filter brightness-0 invert" : ""}`}
                  />
                </div>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content + Footer */}
      <div className="flex flex-col flex-1 bg-white ml-64">
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
