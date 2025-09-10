import Image from 'next/image';
import { ourStoryData } from './data';

export default function OurStory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-5xl font-bold text-gray-900 tracking-wide uppercase">
            {ourStoryData.mainTitle}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ">
          <div className="space-y-8 max-w-xl mx-auto">
            <h3 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
              {ourStoryData.sectionTitle}
            </h3>
            
            <div className="space-y-6">
              {ourStoryData.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-primary font-medium text-xl leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative w-[560px] h-[503px] aspect-square rounded-3xl overflow-hidden shadow-2xl bg-black">
              <Image
                src={ourStoryData.image}
                alt="Coin making process"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}