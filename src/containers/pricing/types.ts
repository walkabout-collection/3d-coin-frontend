export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  heroImage: {
    src: string;
    alt: string;
  };
  badge?: string;
}