"use client";

import React from "react";
import Link from "next/link";
import Button from "@/src/components/common/button/Button";

const NotFound = () => {
  return (
    <section className="relative min-h-screen bg-gradient-light overflow-hidden flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl sm:text-7xl font-bold text-primary">
          404
        </h1>
        <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-ternary">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-text-medium max-w-xl mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="secondary" className="px-6 py-3">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
    </section>
  );
};

export default NotFound;
