'use client';

import { useState, useEffect } from 'react';

interface HeroClientProps {
  children: React.ReactNode;
}

export default function HeroClient({ children }: HeroClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}