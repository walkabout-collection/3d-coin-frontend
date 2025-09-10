import React from 'react';
import Image from 'next/image';
import { HowItWorksStep as StepType } from '../../HowItWorksSection/types';

interface HowItWorksStepProps {
  step: StepType;
  showCurve?: boolean;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ step, showCurve = true }) => {
  return (
    <div className="flex items-center">
      <div className="bg-primary p-6 rounded-2xl text-white w-[250px] h-[241px] flex flex-col justify-between relative">
        <div className="text-gray-300 text-2xl font-medium">
          {step.stepNumber}
        </div>
                <div className="flex justify-center mb-4">
          <Image 
            src={`/images/home/${step.iconName}.svg`}
            alt={step.title}
            width={60}
            height={50}
          />
        </div>
                <div className="text-center">
          <h3 className="text-white font-medium text-sm leading-tight mb-1 uppercase">
            {step.title}
          </h3>
          <p className="text-white font-medium text-lg leading-tight uppercase mb-2">
            {step.description}
          </p>
        </div>
      </div>
            {showCurve && (
     <div className="ml-[-4px] -mr-[4px] flex items-center"> 
          <Image
            src="/images/home/curve.svg"
            alt="connecting curve"
            width={103}
            height={30}
          />
        </div>
      )}
    </div>
  );
};

export default HowItWorksStep;