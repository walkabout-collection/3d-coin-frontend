"use client";

import Image from "next/image";
import { HeroSection as HeroSectionType } from "../../containers/home/types";
import HeroClient from "./HeroClient";
import Button from "../common/button/Button";

interface HeroSectionProps {
  data: HeroSectionType;
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <HeroClient>
      <section className="relative min-h-screen max-h-screen bg-gradient-to-r from-[#0F1C2E] to-[#1E3A6B] shadow-lg  overflow-hidden">
        {/* Dark overlay for that deep navy look */}
        <div className="absolute inset-0 bg-[#0F1C2E]" />

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            {/* Left Content */}
            <div className="text-white space-y-8 lg:space-b-10 -mt-32">
              {data.badge && (
                <div className="inline-block">
                  <span className="text-white text-xl font-semibold tracking-[0.2em] uppercase">
                    {data.badge}
                  </span>
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-5xl font-bold leading-[1.1] tracking-tight w-full">
                <span className="mb-2 block text-white font-bold">
                  {data.title}
                </span>
              </h1>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-xl font-light leading-[1.2] tracking-tight w-full">
                <span className="mb-2 block text-white font-bold max-w-9/12">
                  {data.description}
                </span>
              </h1>

              <div className="pt-6 lg:pt-8">
                <Button
                  width="w-full sm:w-auto px-8"
                  variant="secondary"
                  onClick={() => console.log("CTA clicked")}
                >
                  <span>{data.ctaText}</span>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0 h-full w-full min-h-screen">
              <div className="relative w-full h-full min-h-screen max-h-screen">
                {/* Ensure the container has height */}
                <Image
                  src={data.heroImage.src}
                  alt={data.heroImage.alt}
                  fill
                  priority
                  quality={95}
                  className="object-contain" // or object-cover if you want it cropped
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side vignette effects */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
      </section>
    </HeroClient>
  );
}
