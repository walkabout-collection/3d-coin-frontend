'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Ruler, 
  Layers, 
  Square, 
  Type, 
  Palette, 
  Check 
} from 'lucide-react';
import { Step } from '@/src/containers/standard-builder/dimensions/types';
import { initialSteps, updateStepsBasedOnPath } from '@/src/containers/standard-builder/dimensions/data';

const iconMap = {
  ruler: Ruler,
  layers: Layers,
  square: Square,
  type: Type,
  palette: Palette,
};

const StandardBuilderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const updatedSteps = updateStepsBasedOnPath(pathname, initialSteps);
    setSteps(updatedSteps);
  }, [pathname]);

  const handleStepClick = (stepId: string, path: string) => {
    router.push(path); 
  };

  const getStepClasses = (step: Step) => {
    if (step.completed) {
      return 'bg-primary text-white';
    } else if (step.active) {
      return 'bg-primary text-black';
    } else {
      return 'bg-gray-200 text-black';
    }
  };

  const getIconColor = (step: Step) => {
    if (step.completed) {
      return 'text-white';
    } else if (step.active) {
      return 'text-yellow-500';
    } else {
      return 'text-gray-600';
    }
  };

  const getProgressLineWidth = () => {
    const activeIndex = steps.findIndex(step => step.active);
    const completedCount = steps.filter(step => step.completed).length;
    
    if (activeIndex === -1) return 0;
    
    const totalSteps = steps.length;
    const stepWidth = 100 / (totalSteps - 1); 
    if (steps[activeIndex] && !steps[activeIndex].completed) {
      return (completedCount * stepWidth) + (stepWidth / 2);
    }
    
    return completedCount * stepWidth;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex px-4">
        <div className="flex py-6 border-b border-gray-200 w-full relative">
          {/* Progress Line */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-gray-700 transition-all duration-500 ease-out"
               style={{ width: `${getProgressLineWidth()}%` }}>
          </div>
          
          <div className="flex w-full justify-around items-start">
            {steps.map((step, index) => {
              const IconComponent = step.completed ? Check : iconMap[step.icon as keyof typeof iconMap];
              
              return (
                <div key={step.id} className="flex flex-col items-center space-y-6">
                  <button
                    onClick={() => handleStepClick(step.id, step.path)}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 ease-in-out
                      hover:scale-105 focus:outline-none 
                      ${getStepClasses(step)}
                    `}
                    disabled={!step.active && !step.completed}
                  >
                    <IconComponent 
                      size={32} 
                      className={`${getIconColor(step)} transition-colors duration-300`}
                    />
                  </button>
                  
                  <span className={`
                    text-base font-semibold tracking-wide text-center
                    ${step.active ? 'text-yellow-600' : 
                      step.completed ? 'text-primary' : 'text-primary'}
                    transition-colors duration-300
                  `}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 bg-white">
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default StandardBuilderLayout;