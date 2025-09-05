import { homepageHero } from "./data";

export default function HomePage() {
  return (
    <div>
      <section className="text-center py-16 text-white bg-primary">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {homepageHero.title}
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          {homepageHero.subtitle}
        </p>
        <a
          href={homepageHero.ctaLink}
          className="bg-ternary text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-300 transition"
        >
          {homepageHero.ctaText}
        </a>
      </section>
    </div>
  );
}
