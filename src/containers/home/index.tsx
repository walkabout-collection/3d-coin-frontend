import HeroSection from "@/src/components/HomePageHero/HeroSection";
import { heroSectionData } from "./data";
import CardSection from "@/src/components/HomeCardsSection";
import HowItWork from "@/src/components/HowItWorksSection";
import CoinBuilder from "@/src/components/CoinBuilderSection.tsx";

export default function HomePage() {
  return (
    <main>
      <HeroSection data={heroSectionData} />
      <CardSection />
      <HowItWork />
      <CoinBuilder />
    </main>
  );
}
