import Image from "next/image";
import { CardProps } from "./types";
import Link from "next/link";

export const Card = ({
  imageSrc,
  title,
  description,
  buttonText,
  buttonHref,
  height,
  width,
  className,
  imageClassName,
}: CardProps) => {
  return (
    <div className="flex flex-col">
      <div
        className={`bg-white rounded-3xl p-6 drop-shadow-2xl shadow-amber-200 shadow-lg border-4 border-yellow-400 max-w-sm mx-auto flex flex-col h-full ${
          className ? className : ""
        }`}
        style={{
          height: height ? `${height}px` : "auto",
          width: width ? `${width}px` : "100%",
          maxWidth: width ? `${width}px` : "384px",
        }}
      >
        {/* Image Container */}
        <div className="relative h-64 w-full mb-6 rounded-2xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={`object-cover ${imageClassName ? imageClassName : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-4 uppercase tracking-wide">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-700 text-center mb-8 flex-grow leading-relaxed">
          {description}
        </p>
      </div>

      {/* Button - Separate from card */}
      <div className="mt-4">
        <Link
          href={buttonHref}
          className="block bg-gradient-to-r from-gray-800 to-blue-900 hover:from-gray-900 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-full text-center transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wider mx-auto"
          style={{
            width: width ? `${width}px` : "100%",
            maxWidth: width ? `${width}px` : "384px",
          }}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};
