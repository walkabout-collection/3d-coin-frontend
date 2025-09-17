export interface Step {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  active: boolean;
  path: string;
}

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

export const updateStepsBasedOnPath = (currentPath: string, allSteps: Step[]): Step[] => {
  const currentStepIndex = allSteps.findIndex(step => step.path === currentPath);
  
  if (currentStepIndex === -1) return allSteps;
  
  return allSteps.map((step, index) => {
    if (index < currentStepIndex) {
      return { ...step, completed: true, active: false };
    }
    
    if (index === currentStepIndex) {
      return { ...step, active: true, completed: false };
    }
    
    return { ...step, active: false, completed: false };
  });
};



export const coinDiameterOptions = [
  { value: '1.75"', label: '1.75"' },
  { value: '25mm', label: '25mm' },
  { value: '30mm', label: '30mm' },
  { value: '35mm', label: '35mm' },
  { value: '40mm', label: '40mm' },
];

export const coinThicknessOptions = [
  { value: '1.75"', label: '1.75"' },
  { value: '2mm', label: '2mm' },
  { value: '3mm', label: '3mm' },
  { value: '4mm', label: '4mm' },
  { value: '5mm', label: '5mm' },
];