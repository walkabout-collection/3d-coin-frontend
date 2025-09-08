'use client';
import Image from 'next/image';
import { useState } from 'react';
import { testimonialsData } from './data';
import { Testimonial } from './types';
import nextArrow from '@/public/images/home/next-arrow.svg';
import prevArrow from '@/public/images/home/pre-arrow.svg';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(1); 

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.testimonials.length) % testimonialsData.testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex - 1 + i + testimonialsData.testimonials.length) % testimonialsData.testimonials.length;
      visible.push({
        ...testimonialsData.testimonials[index],
        position: i, 
      });
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();
  const activeTestimonial = visibleTestimonials[1]; 

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {testimonialsData.mainTitle}
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-primary uppercase">
            {testimonialsData.subtitle}
          </h3>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-8">
            <blockquote className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed h-34 mb-6">
              "{activeTestimonial.testimonial}"
            </blockquote>
            <cite className="text-lg font-semibold text-primary">
              {activeTestimonial.name}, {activeTestimonial.title}
            </cite>
          </div>
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-2">
              <Image src="/images/home/google.svg" alt="Google" width={80} height={80} />
              <span className="text-gray-600">(4.6)</span>
              <span className="text-sm text-gray-500">Rating</span>
              <div className="flex items-center ml-4">
                <span className="text-xl font-medium text-ternary mr-2">
                  {activeTestimonial.rating}.0
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-ternary">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 relative z-10 h-24"> 
            {visibleTestimonials.map((testimonial, index) => {
              const isCenter = index === 1;
              const sizeClass = isCenter ? 'w-28 h-28 scale-100' : 'w-16 h-16 ';
              return (
                <div
                  key={testimonial.id}
                  className={`relative rounded-full  transition-all duration-500 cursor-pointer ${sizeClass}`}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={isCenter ? 96 : 64}
                    height={isCenter ? 96 : 64}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
         
        </div>

        <div className="absolute inset-0 flex items-center justify-between mx-auto max-w-7xl  z-20">
          <button
            onClick={prevTestimonial}
            className={`p-5 rounded-full transition-colors duration-300 flex-shrink-0 ${
              currentIndex === 0 ? 'bg-gray-300' : 'bg-primary hover:bg-primary text-white'
            }`}
            aria-label="Previous testimonial"
          >
            <Image
              src={prevArrow}
              alt="Previous"
              width={20}
              height={20}
              className={currentIndex === 0 ? 'invert' : ''}
            />
          </button>

          <button
            onClick={nextTestimonial}
            className={`p-5 rounded-full transition-colors duration-300 flex-shrink-0 ${
              currentIndex === testimonialsData.testimonials.length - 1
                ? 'bg-gray-300'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
            aria-label="Next testimonial"
          >
            <Image
              src={nextArrow}
              alt="Next"
              width={20}
              height={20}
              className={currentIndex === testimonialsData.testimonials.length - 1 ? 'invert' : ''}
            />
          </button>
        </div>
      </div>
    </section>
  );
}