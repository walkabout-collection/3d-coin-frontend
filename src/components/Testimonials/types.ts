import { StaticImageData } from "next/image";

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  testimonial: string;
  rating: number;
  image: string | StaticImageData;
}

export interface TestimonialsData {
  mainTitle: string;
  subtitle: string;
  testimonials: Testimonial[];
}
