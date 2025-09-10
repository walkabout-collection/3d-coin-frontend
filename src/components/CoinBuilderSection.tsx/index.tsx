'use client';
import React from "react";
import { CoinBuilderSection as SectionType } from "./types";
import Image from "next/image";
import Button from "../common/button/Button";
import { coinBuilderSections } from "./data";
import { useRouter } from "next/navigation";

const CoinBuilderSection: React.FC = () => {
      const router = useRouter();

  return (
    <div className="container mx-auto px-10">
      {coinBuilderSections.map((section: SectionType, index: number) => (
        <div
          key={index}
          className={`section-container ${
            index % 2 === 0 ? "section-container-odd" : "section-container-even"
          }`}
        >
          <div className=" max-w-2xl">
            <p className="text-xl uppercase text-primary font-bold mb-8">
              {section.subtitle}
            </p>
            <h2 className="text-5xl md:text-5xl max-w-2xl font-bold text-primary mb-4">
              {section.title}
            </h2>
            <p className="text-md md:text-2xl leading-tighter space-pre-line py-6">
              {section.description}
            </p>
            <Button
              className="cursor-pointer py-4 px-6 text-xl"
              variant="primary"
              style={{ width: "300px" }}
              type="button"
                 onClick={() => router.push(section.link)}
            >
              {section.buttonText}
            </Button>
          </div>
          <div className="  md:h-[478px] md:w-[449px] flex flex-col items-center justify-center">
            <Image
              src={section.image ?? "/placeholder.png"}
              alt={section.title}
              width={468}
              height={439}
              className="object-cover w-[468px] h-[439px] rounded-3xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoinBuilderSection;
