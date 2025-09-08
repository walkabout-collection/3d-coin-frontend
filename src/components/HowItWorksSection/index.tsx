import React from 'react';
import HowItWorksStep from '../common/howItWorkStep';
import { howItWorksData } from './data';

const HowItWork: React.FC = () => {
  return (
    <section className="py-16  bg-gray-50">
      <div className=" mb-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-4xl text-primary font-bold uppercase">
            (Process Breakdown)
          </p>
        </div>
        <div className="flex justify-center items-center overflow-x-auto">
          <div className="flex items-center min-w-max">
            {howItWorksData.steps.map((step, index) => (
              <HowItWorksStep 
                key={step.id}
                step={step}
                showCurve={index < howItWorksData.steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;