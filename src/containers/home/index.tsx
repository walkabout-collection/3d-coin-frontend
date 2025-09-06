import HeroSection from "@/src/components/Hero/HeroSection";
import { heroSectionData } from "./data";

export default function HomePage() {
  return (
    <main>
      <HeroSection data={heroSectionData}  />
    </main>
  );
}