import HeroSection from "@/src/components/HomePageHero/HeroSection";
import { heroSectionData } from "./data";

export default function Pricing() {
  return (
    <main>
      <HeroSection data={heroSectionData}  />
    </main>
  );
}