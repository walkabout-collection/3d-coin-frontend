import { StaticImageData } from "next/image";

export interface OurStoryData {
  mainTitle: string;
  sectionTitle: string;
  paragraphs: string[];
  image: string | StaticImageData;
}