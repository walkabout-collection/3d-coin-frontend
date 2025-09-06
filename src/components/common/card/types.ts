export interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  height?: number; // Optional height in pixels
  width?: number; // Optional width in pixels
  className?: string;
  imageClassName?: string;
}

export type CardsData = CardProps[];
