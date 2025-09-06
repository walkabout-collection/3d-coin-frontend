import HeroSection from "@/src/components/home/HeroSection";
import { heroSectionData } from "./data";

export default function HomePage() {
  return (
    <main>
      <HeroSection data={heroSectionData}  />
    </main>
  );
}