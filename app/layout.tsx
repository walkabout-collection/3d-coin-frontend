import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/common/layout/navbar/Navbar";
import Footer from "@/src/components/common/layout/Footer";
import ReactQueryProvider from "@/src/providers/ReactQueryProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.legacyforge.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Legacy Forge | Custom 3D Coins",
    template: "%s | Legacy Forge",
  },
  description:
    "Design and build your coins with Legacy Forge’s 3D builder. Preserve your legacy forever with custom-crafted coins.",
  applicationName: "Legacy Forge",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Legacy Forge",
    url: "/",
    title: "Legacy Forge | Custom 3D Coins",
    description:
      "Design and build your coins with Legacy Forge’s 3D builder. Preserve your legacy forever with custom-crafted coins.",
    images: [
      {
        url: "/images/HeroCoin.png",
        width: 1200,
        height: 630,
        alt: "Legacy Forge — Custom 3D Coins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legacy Forge | Custom 3D Coins",
    description:
      "Create personalized 3D coins with Legacy Forge’s online builder. Unique designs, premium materials, built to last.",
    images: ["/images/HeroCoin.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <div className="mb-20">
            <Navbar />
          </div>
          {children}
          <Footer />
          <ToastContainer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
