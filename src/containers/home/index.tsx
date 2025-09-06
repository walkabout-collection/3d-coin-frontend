import HeroSection from "@/src/components/HomePageHero/HeroSection";
import { heroSectionData } from "./data";
import CardSection from "@/src/components/HomeCardsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection data={heroSectionData} />
      <CardSection />
    </main>
  );
}
