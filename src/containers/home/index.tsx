import HeroSection from "@/src/components/HomePageHero/HeroSection";
import { heroSectionData } from "./data";
import CardSection from "@/src/components/HomeCardsSection";
import HowItWork from "@/src/components/HowItWorksSection";
import CoinBuilder from "@/src/components/CoinBuilderSection.tsx";
import WhoWeBuildFor from "@/src/components/WhoWeBuildFor";
import OurStory from "@/src/components/OurStory";
import Testimonials from "@/src/components/Testimonials";

export default function HomePage() {
  return (
    <main>
      <HeroSection data={heroSectionData} />
      <CardSection />
      <HowItWork />
      <CoinBuilder />
      <WhoWeBuildFor />
      <Testimonials />
      <OurStory />
    </main>
  );
}
