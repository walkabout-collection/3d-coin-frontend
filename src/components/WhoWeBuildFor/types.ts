import { StaticImageData } from "next/image";

export interface WhoWeBuildForItem {
  title: string;
  description: string;
  image: string | StaticImageData;
}