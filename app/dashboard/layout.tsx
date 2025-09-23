"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserProfilesLayoutProps } from "@/src/containers/dashboard/types";
import { sidebarItems } from "@/src/containers/dashboard/data";
import { useLogout } from "@/src/hooks/useQueries";


export default function UserProfilesLayout({
  children,
}: UserProfilesLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
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
    (item) => item.name !== "Account Setting" && item.name !== "Log Out"
  );
  const bottomItems = sidebarItems.filter(
    (item) => item.name === "Account Setting" || item.name === "Log Out"
  );


  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-[#f5f7fa] shadow-lg p-4 flex flex-col justify-between">
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


      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
