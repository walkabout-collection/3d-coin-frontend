import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/common/layout/navbar/Navbar";
import Footer from "@/src/components/common/layout/Footer";
import ReactQueryProvider from "@/src/providers/ReactQueryProvider"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legacy Forge | Custom 3D Coins",
  description:
    "Design and build your coins with Legacy Forge’s 3D builder. Preserve your legacy forever with custom-crafted coins.",
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
      >
        <ReactQueryProvider>
          <div className="mb-20">
            <Navbar />
          </div>
          {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
