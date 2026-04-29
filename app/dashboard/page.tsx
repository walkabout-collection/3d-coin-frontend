import { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/src/constants/routes";
import DashboardContainer from "@/src/containers/dashboard";

export const metadata: Metadata = {
  title: routes.DASHBOARD.metaTitle,
  description: routes.DASHBOARD.description,
  openGraph: {
    title: routes.DASHBOARD.metaTitle,
    description: routes.DASHBOARD.description,
    url: routes.DASHBOARD.path,
  },
  alternates: {
    canonical: routes.DASHBOARD.path,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function DashboardPage() {
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
      <DashboardContainer />
    </Suspense>
  );
}
