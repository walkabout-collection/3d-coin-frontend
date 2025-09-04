import { HeroSection as HeroSectionType } from "@/src/containers/home/types";

interface HeroSectionProps {
  data: HeroSectionType;
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="text-center py-12 bg-white">
      <h1 className="text-3xl font-bold text-black mb-4">{data.title}</h1>
      <p className="max-w-2xl mx-auto text-gray-700 mb-6">{data.subtitle}</p>
      <a
        href={data.ctaLink}
        className="bg-black text-white px-5 py-2 rounded-md"
      >
        {data.ctaText}
      </a>
    </section>
  );
}
