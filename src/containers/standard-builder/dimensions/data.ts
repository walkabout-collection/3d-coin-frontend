import { Step } from './types';

export const initialSteps: Step[] = [
  {
    id: 'dimensions',
    title: 'DIMENSIONS',
    icon: 'ruler',
    completed: false,
    active: true,
    path: '/standard-builder' 
  },
  {
    id: 'material',
    title: 'MATERIAL',
    icon: 'layers',
    completed: false,
    active: false,
    path: '/standard-builder/material' 
  },
  {
    id: 'edge-type',
    title: 'EDGE TYPE',
    icon: 'square',
    completed: false,
    active: false,
    path: '/standard-builder/edge-type'
  },
  {
    id: 'text-rings',
    title: 'TEXT RINGS',
    icon: 'type',
    completed: false,
    active: false,
    path: '/standard-builder/text-rings' 
  },
  {
    id: 'artwork',
    title: 'ARTWORK',
    icon: 'palette',
    completed: false,
    active: false,
    path: '/standard-builder/artwork'
  }
];

export const updateStepStatus = (stepId: string, completed: boolean = true): Step[] => {
  return initialSteps.map((step, index) => {
    if (step.id === stepId) {
      return { ...step, completed, active: false };
    }
    
    const currentIndex = initialSteps.findIndex(s => s.id === stepId);
    
    if (completed && index === currentIndex + 1) {
      return { ...step, active: true };
    }
    
    if (step.id !== stepId && index !== currentIndex + 1) {
      return { ...step, active: false };
    }
    
    return step;
  });
};