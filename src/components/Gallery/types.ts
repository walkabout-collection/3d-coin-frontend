import { StaticImageData } from "next/image";

export interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  image: string | StaticImageData;
}

export interface GalleryData {
  title: string;
  items: GalleryItem[];
}