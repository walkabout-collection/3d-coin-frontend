import { adminRoutes } from "@/src/constants/routes";
import { Metadata } from "next";
import { Suspense } from "react";
import AdminDashboardContainer from "@/src/containers/admin/dashboard";

export const metadata: Metadata = {
  title: adminRoutes.DASHBOARD.metaTitle,
  description: adminRoutes.DASHBOARD.description,
  openGraph: {
    title: adminRoutes.DASHBOARD.metaTitle,
    description: adminRoutes.DASHBOARD.description,
    url: adminRoutes.DASHBOARD.path,
  },
  alternates: {
    canonical: adminRoutes.DASHBOARD.path,
  },
};

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a3a] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <AdminDashboardContainer />
    </Suspense>
  );
}
