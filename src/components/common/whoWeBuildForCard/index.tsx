'use client';
import Image from 'next/image';
import { WhoWeBuildForItem } from '../../WhoWeBuildFor/types';

interface WhoWeBuildForCardProps {
  item: WhoWeBuildForItem;
}

export const WhoWeBuildForCard: React.FC<WhoWeBuildForCardProps> = ({ item }) => {
  return (
    <div className="group relative mx-auto" style={{width: '337px', height: '233px'}}>
      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
        
        <div className="absolute inset-0 opacity-10 items-center justify-center flex z-0">
                      <div className="relative w-60 h-50">

          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
          />
            </div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-20">
          <h3 className="text-xl font-bold text-white text-center mb-3 leading-tight uppercase tracking-wide">
            {item.title}
          </h3>
          <p className="text-white text-center text-md leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
          <div className="relative w-60 h-50">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-contain filter drop-shadow-lg"
            />
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        
        <div className="absolute inset-0 rounded-xl border border-gray-600/20 group-hover:border-gray-400/30 transition-colors duration-500"></div>
      </div>
    </div>
  );
};