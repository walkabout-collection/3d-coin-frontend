'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryData } from './data';

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(1); 
  const { items } = galleryData;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex - 1 + i + items.length) % items.length;
      visible.push({
        ...items[index],
        position: i // 0: left, 1: center, 2: right
      });
    }
    return visible;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-wide uppercase">
            {galleryData.title}
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto">
          <div className="flex items-center justify-center">
            
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-4 z-10 p-4 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-200 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Images Container */}
            <div className="flex items-center justify-center space-x-12">
              {visibleItems.map((item, index) => {
                const isCenter = index === 1;
                const containerClasses = isCenter 
                  ? "w-[392px] h-[456px]" 
                  : "w-[392px] h-[349px]"; 
                
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`relative ${containerClasses} group cursor-pointer transition-all duration-500 transform hover:scale-105`}
                    onClick={() => {
                      if (index === 0) prevSlide();
                      if (index === 2) nextSlide();
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={item.image}
                        alt={`${item.title} ${item.subtitle}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        priority={isCenter}
                      />
                      
                      {/* Overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Text Overlay */}
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-white text-lg font-semibold mb-1 tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-white text-xl font-bold">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-4 z-10 p-4 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-200 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}