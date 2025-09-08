import { StaticImageData } from "next/image";

export interface CoinBuilderSection {
  title: string;
    subtitle: string;
  description: string;
  image: string | StaticImageData;
  buttonText?: string;
  link: string;
}